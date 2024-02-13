const Room = require('../models/room')
const Message = require('../models/message')
const User = require('../models/user')
const RoomParticipant = require('../models/roomParticipant')

/**
 * Sets up WebSockets to handle real-time connections.
 * @param {Object} io - Socket.io instance to configure WebSocket events.
 */
exports.setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user has connected')

    /**
     * Event to join a specific room. Searches for the room by name and loads previous messages.
     * @param {String} roomName - The name of the room the user tries to join.
     */
    socket.on('join room', async (roomName) => {
      const room = await Room.findOne({ where: { room_name: roomName } })
      if (room) {
        socket.join(room.room_name)
        const messages = await Message.findAll({
          where: { room_id: room.room_id },
          include: [{ model: User, attributes: ['nickname'] }]
        })
        const messagesWithUsernames = messages.map((message) => ({
          message: message.message,
          username: message.User.nickname, // user-message relationship
          timestamp: message.timestamp
        }))
        socket.emit('load previous messages', messagesWithUsernames)
      }
    })

    /**
     * Event to create a new chat room or join if it already exists.
     * @param {String} roomName - The name of the room to be created or joined.
     */
    socket.on('create room', async (roomName) => {
      let room = await Room.findOne({ where: { room_name: roomName } })
      const userId = socket.request.session.user.id

      if (!room) {
        try {
          room = await Room.create({ room_name: roomName })
          await RoomParticipant.create({
            room_id: room.room_id,
            user_id: userId
          })
          console.log(
            `Room ${roomName} created and user added as a participant.`
          )
        } catch (error) {
          console.error('Error creating the room:', error)
          return
        }
      } else {
        const isParticipant = await RoomParticipant.findOne({
          where: {
            room_id: room.room_id,
            user_id: userId
          }
        })

        if (!isParticipant) {
          await RoomParticipant.create({
            room_id: room.room_id,
            user_id: userId
          })
          console.log(`User added to the existing room ${roomName}.`)
        }
      }

      // Join the user to the room in Socket.io
      socket.join(room.room_name)
      socket.emit('room created', { room_name: room.room_name }) // Emit to the user to confirm joining the room
    })

    /**
     * Event to send a chat message in a room. Saves the message and distributes it to the room members.
     * @param {Object} data - Message data, including the room name and message content.
     */
    socket.on('chat message', async (data) => {
      const { roomName, message } = data
      const userId = socket.request.session.user.id
      const room = await Room.findOne({ where: { room_name: roomName } })

      if (room) {
        const newMessage = await Message.create({
          room_id: room.room_id,
          user_id: userId,
          message: message,
          timestamp: new Date()
        })

        const messageWithUser = await Message.findOne({
          where: { message_id: newMessage.message_id },
          include: [{ model: User, attributes: ['nickname'] }]
        })
        io.to(roomName).emit('chat message', {
          message: messageWithUser.message,
          username: messageWithUser.User.nickname,
          roomName: roomName
        })
      }
    })
  })
}

/**
 * Loads the rooms a user is a participant of.
 * @param {number} userId - The user's ID.
 * @returns The rooms the user is a participant of.
 */
async function loadUserRooms(userId) {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          as: 'Users',
          where: { user_id: userId },
          attributes: [],
          through: {
            attributes: []
          }
        }
      ]
    })

    return rooms.map((room) => ({
      room_id: room.room_id,
      room_name: room.room_name
    }))
  } catch (error) {
    console.error("Error loading the user's rooms:", error)
    return []
  }
}

/**
 * Renders the chat view with the rooms available to the user.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.renderChat = async (req, res) => {
  const userId = req.session.user.id
  const rooms = await loadUserRooms(userId)
  const { nickname } = await User.findOne({ where: { user_id: userId } })
  res.render('chat', { rooms, nickname })
}

/**
 * Renders the chat view for a specific room.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.renderChatRoom = async (req, res) => {
  const userId = req.session.user.id
  const roomName = req.params.roomName
  const { nickname } = await User.findOne({ where: { user_id: userId } })
  const rooms = await loadUserRooms(userId)
  res.render('chat', { roomName, rooms, nickname })
}
