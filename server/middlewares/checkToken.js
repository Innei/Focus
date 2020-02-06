const token = require('jsonwebtoken')
const User = require('~/models/User')
module.exports = ({ getStatus } = {}) => {
  return async ({ request, response, next }) => {
    if (request.headers.authorization) {
      try {
        const { code, _id } = token.verify(
          request.headers.authorization,
          process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
        )
        const { authCode } = await User.findById(_id).select({ authCode: 1 })

        if (code === authCode) {
          if (getStatus) {
            request.logged = 1
            return next()
          }
          response.body = { ok: 1, logged: 1 }
          return
        }
      } catch (e) {}
    }
    if (getStatus) {
      request.logged = 0
      return next()
    }
    response.body = { ok: 1, logged: 0 }
    return
  }
}
