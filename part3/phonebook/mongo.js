const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.cjh6j.mongodb.net/persons?retryWrites=true&w=majority`

const name = process.argv[3]
const number = process.argv[4]

if (password) {
  mongoose
    .connect(url)
    .then(() => {
      // define schema
      const personSchema = new mongoose.Schema({
        name: String,
        number: String,
      })
      // create model
      const Person = mongoose.model('Person', personSchema)
      // check arguments
      if (!name || !number) {
        Person
          .find({})
          .then(results => {
            console.log('phonebook:')
            results.forEach(person => {
              console.log(`${person.name} ${person.number}`)
            })
            // close connection
            mongoose.connection.close()
          })
      } else {
        const newPerson = new Person({ name, number })
        newPerson
          .save()
          .then(saved => {
            console.log(`added ${saved.name} number ${saved.number} to phonebook`)
            // close connection
            mongoose.connection.close()
          })
      }
    })
    .catch(error => {
      console.error('error: unable to connect to database!')
    })
} else {
  console.log('error: please provide database password!');
}