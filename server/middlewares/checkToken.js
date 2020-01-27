const token = require('jsonwebtoken')
const User = require('~~/models/User')
module.exports = ({ getStatus } = {}) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      try {
        const { code, _id } = token.verify(
          req.headers.authorization,
          process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
        )
        const { authCode } = await User.findById(_id).select({ authCode: 1 })

        if (code === authCode) {
          if (getStatus) {
            req.logged = 1
            return next()
          }
          return res.send({ ok: 1, logged: 1 })
        }
      } catch (e) {}
    }
    if (getStatus) {
      req.logged = 0
      return next()
    }
    return res.send({ ok: 1, logged: 0 })
  }
}
