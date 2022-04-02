import axios from 'axios'

const url = '/api/persons'

const getAll = async () => {
  const request = axios.get(url)
  return request.then(response => response.data)
}

const addPerson = (newPerson) => {
  const request = axios.post(url, newPerson)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
  const request = axios.delete(`${url}/${id}`)
  return request.then(response => response.status)
}

const updatePerson = (updatedPerson) => {
  const request = axios.put(`${url}/${updatedPerson.id}`, updatedPerson)
  return request.then(response => response.data)
}

export default { getAll, addPerson, deletePerson, updatePerson }