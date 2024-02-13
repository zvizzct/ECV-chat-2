// models/roomParticipant.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const RoomParticipant = sequelize.define(
  'RoomParticipant',
  {
    participant_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'room_participants',
    timestamps: false
  }
)

module.exports = RoomParticipant
