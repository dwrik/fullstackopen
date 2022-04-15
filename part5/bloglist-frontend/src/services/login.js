import axios from 'axios'

let token = null
const baseUrl = '/api/login'

const setToken = (userToken) => {
  token = userToken
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { setToken, login }