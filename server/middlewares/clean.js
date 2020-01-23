const clean = require('mongo-sanitize')
module.exports = (req, res, next) => {
  req.body = clean(req.body)
  next()
}
