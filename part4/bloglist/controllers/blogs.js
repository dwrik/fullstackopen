const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const { user } = request
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, { new: true, runValidators: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const { user } = request
  const blog = await Blog.findById(request.params.id)
  if (!(user && blog)) {
    return response.status(401).json({
      error: 'invalid user or blog'
    })
  }
  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({
      error: 'you are not authorized to perform this operation',
    })
  }
  await Blog.findByIdAndDelete(blog._id)
  response.status(204).end()
})

module.exports = blogsRouter