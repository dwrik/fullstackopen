const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./users_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('creation of a new user', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'jack',
      password: 'ihatebarbosa',
      name: 'Jack Sparrow',
    }

    const usersAtStart = await helper.getUsersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.getUsersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails when username or password is missing', async () => {
    const newUser = {
      username: 'jack',
      name: 'Jack Sparrow',
    }

    const usersAtStart = await helper.getUsersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('username or password missing')

    const usersAtEnd = await helper.getUsersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fails when username or password is not atleast 3 characters long', async () => {
    const newUser = {
      username: 'jack',
      password: 'jk',
      name: 'Jack Sparrow',
    }

    const usersAtStart = await helper.getUsersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('username & password must be atleast 3 characters long')

    const usersAtEnd = await helper.getUsersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fails when username is not unique', async () => {
    const newUser = {
      username: 'jack',
      password: 'ihatebarbossa',
      name: 'Jack Sparrow',
    }

    const saved = new User(newUser)
    await saved.save()

    const usersAtStart = await helper.getUsersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.getUsersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(() => {
  mongoose.connection.close()
})