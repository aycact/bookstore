require('dotenv').config()
const { Sequelize } = require('sequelize')

// connect db
const sequelize = new Sequelize(
  process.env.DB_CONNECTION_STRING,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true',
  }
)

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

sequelize.sync()
testConnection()

module.exports = sequelize
