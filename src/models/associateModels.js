const User = require('./user')
const Room = require('./room')
const Message = require('./message')
const RoomParticipant = require('./roomParticipant')

/**
 * Associate the models to define the relationships between them.
 */
function associateModels() {
  User.hasMany(Message, { foreignKey: 'user_id' })
  Message.belongsTo(User, { foreignKey: 'user_id' })

  Room.hasMany(Message, { foreignKey: 'room_id' })
  Message.belongsTo(Room, { foreignKey: 'room_id' })

  Room.belongsToMany(User, {
    through: RoomParticipant,
    foreignKey: 'room_id',
    otherKey: 'user_id'
  })
  User.belongsToMany(Room, {
    through: RoomParticipant,
    foreignKey: 'user_id',
    otherKey: 'room_id'
  })
}

associateModels()
