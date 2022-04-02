const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 99999)
}

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const data = request.body
  if (!data.name || !data.number) {
    return response.status(400).send({
      error: 'name or number missing'
    })
  }
  if (persons.find(person => person.name.toLowerCase() === data.name.toLowerCase())) {
    return response.status(400).send({
      error: 'name must be unique'
    })
  }
  const person = {
    id: generateId(),
    name: data.name,
    number: data.number,
  }
  persons = persons.concat(person)
  response.send(person)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<p>${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})