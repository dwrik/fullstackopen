require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/Person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body
  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).send({ error: 'person not found' })
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).send({ error: 'person not found' })
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const person = new Person({ name, number })
  person.save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({}, (err, count) => {
    response.send(`<p>Phonebook has info for ${count} people<p>${new Date()}`)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
