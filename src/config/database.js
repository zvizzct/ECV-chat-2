require('dotenv').config()
const { Sequelize } = require('sequelize')

/**
 * This is the database connection configuration.
 * We use the Sequelize constructor to create a new instance of Sequelize.
 */
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false
  }
)

module.exports = sequelize
