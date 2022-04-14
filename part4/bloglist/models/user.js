const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', userSchema)