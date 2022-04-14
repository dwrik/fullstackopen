const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (!(username && password)) {
    return response.status(400).json({
      error: 'username or password missing'
    })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username & password must be atleast 3 characters long'
    })
  }

  const existing = await User.findOne({ username: username })
  if (existing) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedUser = new User({
    name: name,
    username: username,
    password: passwordHash,
  })

  await savedUser.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter