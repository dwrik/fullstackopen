/* eslint-disable no-unused-vars */
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes).reduce((sum, curr) => sum + curr, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((fav, curr) => curr.likes > fav.likes ? curr : fav, blogs[0])

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorBlogs = {}

  blogs.forEach(blog => {
    authorBlogs[blog.author] = (authorBlogs[blog.author] ?? 0) + 1
  })

  const authors = Object.keys(authorBlogs)
  const most = authors.reduce((prev, curr) => authorBlogs[curr] > authorBlogs[prev] ? curr : prev, authors[0])

  return {
    author: most,
    blogs: authorBlogs[most],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = {}

  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] ?? 0) + blog.likes
  })

  const authors = Object.keys(authorLikes)
  const most = authors.reduce((prev, curr) => authorLikes[curr] > authorLikes[prev] ? curr : prev, authors[0])

  return {
    author: most,
    likes: authorLikes[most],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}