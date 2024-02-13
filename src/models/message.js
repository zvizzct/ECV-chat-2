const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Message = sequelize.define(
  'Message',
  {
    message_id: {
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
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'messages',
    timestamps: false
  }
)

module.exports = Message
