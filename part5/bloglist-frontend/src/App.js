import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
    }
  }, [])

  const loginHandler = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error.message)
    }
  }

  const logoutHandler = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <>
        <h2>login</h2>
        <form onSubmit={loginHandler}>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)
          } /><br />
          password
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
