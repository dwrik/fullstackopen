const User = require('../models/user')

const getUsersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  getUsersInDb,
}