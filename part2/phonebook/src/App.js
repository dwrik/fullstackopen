import { useEffect, useState } from 'react'
import personsService from './services/Persons'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const notify = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    personsService
      .getAll()
      .then(persons => setPersons(persons))
      .catch(error => notify({ message: 'Failed to get data', type: 'error' }))
  }, [])

  const handleDeletePerson = (id) => {
    const person = persons.find((person) => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          notify({
            message: `Deleted ${person.name}`,
            type: 'success',
          })
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== id))
          notify({
            message: `Information of '${person.name}' has already been removed from the server`,
            type: 'error',
          })
        })
    }
  }

  const addPerson = (newPerson) => {
    personsService
      .addPerson(newPerson)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
        notify({
          message: `Added ${newPerson.name}`,
          type: 'success'
        })
      })
      .catch(error => {
        notify({
          message: `Failed to add '${newPerson.name}'`,
          type: 'error'
        })
      })
  }

  const updatePerson = (updatedPerson) => {
    personsService
      .updatePerson(updatedPerson)
      .then(updated => {
        setPersons(persons.map(person => person.id !== updated.id ? person : updated))
        setNewName('')
        setNewNumber('')
        notify({
          message: `Updated ${updatedPerson.name}`,
          type: 'success'
        })
      })
      .catch(error => {
        setPersons(persons.filter(person => person.id !== updatedPerson.id))
        setNewName('')
        setNewNumber('')
        notify({
          message: `Information of '${updatedPerson.name}' has already been removed from the server`,
          type: 'error',
        })
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const updatePrompt = 'is already added to phonebook, replace old number with the new one?'
    const existing = persons.find(person => person.name === newName)
    if (existing) {
      if (window.confirm(`${existing.name} ${updatePrompt}`)) {
        updatePerson({ ...existing, number: newNumber })
      }
    } else {
      addPerson({ name: newName, number: newNumber })
    }
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter((person) => person.name.includes(filter))

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons
        persons={personsToShow}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  )
}

export default App