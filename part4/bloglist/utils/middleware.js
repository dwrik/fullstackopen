const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, '-', request.body)
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), config.SECRET)
    if (decodedToken) {
      request.user = await User.findById(decodedToken.id)
    }
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).send({ error: 'token invalid or missing' })
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).send({ error: 'token expired' })
  }
  next(error)
}

module.exports = {
  requestLogger,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}