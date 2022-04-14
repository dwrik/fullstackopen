const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blogs_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const user = {
  username: 'wturner',
  password: 'bootstrap',
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})

  await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returned blogs have an id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('creation of a new blog', () => {
  beforeEach(async () => {
    const response = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    user.token = response.body.token
  })

  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Demo Blog',
      author: 'John Doe',
      url: 'https://demoblog.com/demo-blog',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Demo Blog')
  })

  test('succeeds when likes is missing with zero likes on the blog', async () => {
    const newBlog = {
      title: 'Demo Blog',
      author: 'John Doe',
      url: 'https://demoblog.com/demo-blog',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const savedBlog = response.body
    expect(savedBlog.likes).toBe(0)
  })

  test('fails when authentication token is invalid or missing', async () => {
    const newBlog = {
      title: 'Demo Blog',
      author: 'John Doe',
      url: 'https://demoblog.com/demo-blog',
      likes: 3,
    }

    const blogsAtStart = await helper.blogsInDB()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}asdfjk`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('token invalid or missing')

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toEqual(blogsAtStart)
  })


  test('fails with status code 400 when title or url missing', async () => {
    const newBlog = {
      author: 'John Doe',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('succeeds if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      title: 'updated title',
      likes: 999,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const blogs = blogsAtEnd.map(blog => Object({ title: blog.title, likes: blog.likes }))
    expect(blogs).toContainEqual({ title: 'updated title', likes: 999 })
  })

  test('fails with non existent id', async () => {
    const id = await helper.nonExistentID()

    const updatedBlog = {
      title: 'updated title',
    }

    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(updatedBlog.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})