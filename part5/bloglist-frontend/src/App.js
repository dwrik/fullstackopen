import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error.message)
    }
  }

  const logoutHandler = () => {
    localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createBlogHandler = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error.message)
    }
  }

  if (user === null) {
    return (
      <>
        <h2>login</h2>
        <form onSubmit={loginHandler}>
          username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)
          } /><br />
          password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)
          } /><br />
          <input type="submit" value="login" />
        </form>
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <input type="button" value="logout" onClick={logoutHandler} />
      </p>

      <h2>create blog</h2>
      <form onSubmit={createBlogHandler}>
        title:
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        /><br />
        author:
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        /><br />
        url:
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        /><br />
        <input type="submit" value="create" />
      </form>

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
