const info = (...args) => {
  console.log(...args)
}

const error = (...args) => {
  console.error(...args)
}

module.exports = {
  info,
  error,
}