const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Room = sequelize.define(
  'Room',
  {
    room_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    room_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'rooms',
    timestamps: false
  }
)

module.exports = Room
