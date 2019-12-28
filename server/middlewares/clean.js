const clean = require('mongo-sanitize')
module.exports = (req, res, next) => {
  req.body ? (req.body = clean(req.body)) : undefined
  req.query ? (req.query = clean(req.query)) : undefined

  next()
}
