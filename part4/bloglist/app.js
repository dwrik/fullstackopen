const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
const middleware = require('./utils/middleware')
require('express-async-errors')

logger.info('connecting to', config.MONGO_URI)

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error:', error.message)
  })

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app