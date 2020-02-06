const clean = require('mongo-sanitize')
module.exports = ({ request }) => {
  request.body = clean(request.body)
  next()
}
