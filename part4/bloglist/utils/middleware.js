const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, '-', request.body)
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
    response.status(401).send({ error: 'invalid or missing token' })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}