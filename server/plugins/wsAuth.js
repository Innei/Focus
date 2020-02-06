const token = require('jsonwebtoken')
const User = require('~/models/User')
module.exports = async (req) => {
  if (req.headers.authorization) {
    try {
      const { code, _id } = token.verify(
        req.headers.authorization,
        process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
      )

      const { authCode } = await User.findById(_id).select({ authCode: 1 })

      if (code === authCode) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  return false
}
