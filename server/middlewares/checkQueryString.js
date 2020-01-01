const assert = require('http-assert')

module.exports = (req, res, next) => {
  if (req.query) {
    const hasObject = Object.entries(req.query).some(([key, value]) => {
      return (typeof value === 'object' || typeof value === 'function') &&
        value !== null
        ? true
        : false
    })

    assert(!hasObject, 422, 'query params must be string.')
  }
  next()
}
