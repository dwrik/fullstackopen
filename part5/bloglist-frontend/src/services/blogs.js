import axios from 'axios'

let token = null
const baseUrl = '/api/blogs'

const setToken = (userToken) => {
  token = userToken
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

export default { setToken, getAll, create }
