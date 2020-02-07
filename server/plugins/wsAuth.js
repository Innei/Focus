const jsonwebtoken = require('jsonwebtoken')
const User = require('~/models/User')
module.exports = async (token) => {
  if (token) {
    try {
      const { code, _id } = jsonwebtoken.verify(
        token,
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
