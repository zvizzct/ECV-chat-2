// Establishes a connection with the server via Socket.io.
const socket = io()

/**
 * Determines if there is an active room based on the URL and automatically joins if so.
 */
let currentRoomName = window.location.pathname.split('/chat/')[1]
if (currentRoomName) {
  socket.emit('join room', currentRoomName)
}

/**
 * Adds a listener for the message form submission event.
 * Sends the message to the active room via Socket.io.
 */
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault()
  let input = document.getElementById('input')
  if (input.value && currentRoomName) {
    socket.emit('chat message', {
      roomName: currentRoomName,
      message: input.value
    })
    input.value = '' // Clear the input after sending
  }
})

/**
 * Adds a listener for the new room form submission event.
 * Creates a new room and names it with the value entered by the user.
 */
document
  .getElementById('new-room-form')
  .addEventListener('submit', function (e) {
    e.preventDefault()
    const newRoomInput = document.getElementById('new-room-input')
    if (newRoomInput.value) {
      socket.emit('create room', newRoomInput.value)
      newRoomInput.value = '' // Clear the input after submission
    }
  })

/**
 * Listens for the room creation event and redirects the user to the new room's URL.
 */
socket.on('room created', function (room) {
  window.location.href = `/chat/${room.room_name}`
})

/**
 * Listens for messages sent in the active room and displays them in the UI.
 */
socket.on('chat message', function (data) {
  if (data.roomName === currentRoomName) {
    const item = document.createElement('li')
    item.textContent = `${data.username}: ${data.message}`
    document.getElementById('messages').appendChild(item)
    window.scrollTo(0, document.body.scrollHeight) // Scrolls to the bottom of the chat
  }
})

/**
 * Upon joining a room, loads and displays previous messages sent in that room.
 */
socket.on('load previous messages', function (messages) {
  const messagesList = document.getElementById('messages')
  messagesList.innerHTML = '' // Clears existing messages
  messages.forEach((message) => {
    const item = document.createElement('li')
    item.textContent = `${message.username}: ${message.message}`
    messagesList.appendChild(item)
  })
  window.scrollTo(0, document.body.scrollHeight) // Scrolls to the bottom of the chat
})
