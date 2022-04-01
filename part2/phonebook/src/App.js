import { useEffect, useState } from 'react'
import personsService from './services/Persons'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  useEffect(() => {
    personsService
      .getAll()
      .then(persons => setPersons(persons))
      .catch(error => alert('unable to get data of persons'))
  }, [])

  const addPerson = (newPerson) => {
    personsService
      .addPerson(newPerson)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert(`the person '${newPerson.name}' could not be added`)
      })
  }

  const updatePerson = (updatedPerson) => {
    personsService
      .updatePerson(updatedPerson)
      .then(updated => {
        setPersons(persons.map(person => person.id !== updated.id ? person : updated))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert(`the person '${updatedPerson.name}' was already deleted`)
        setPersons(persons.filter(person => person.id !== updatedPerson.id))
        setNewName('')
        setNewNumber('')
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


  const handleDeletePerson = (id) => {
    const person = persons.find((person) => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personsService
        .deletePerson(id)
        .then(() => setPersons(persons.filter(person => person.id !== id)))
        .catch(error => {
          alert(`${person.name} was already deleted`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter((person) => person.name.includes(filter))

  return (
    <div>
      <h1>Phonebook</h1>
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