require('dotenv').config()

const { PORT, MONGO_URI } = process.env

module.exports = {
  PORT,
  MONGO_URI,
}