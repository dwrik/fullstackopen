const Person = ({ person, handleDeletePerson }) => {
  const { name, number, id } = person
  return (
    <div>
      <span>{name} {number} </span>
      <button onClick={() => handleDeletePerson(id)}>Delete</button>
    </div>
  )
}

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <div>
      {persons.map(person => {
        return <Person
                  key={person.id}
                  person={person}
                  handleDeletePerson={handleDeletePerson}
                />
      })}
    </div>
  )
}

export default Persons