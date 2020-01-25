// 适用于某些通用接口(前后端共用)鉴别是否登录,已查看隐藏或者加密的内容

const token = require('jsonwebtoken')
const User = require('~~/models/User')
/**
 * bind params to app instance
 * @param {Object}  - first object will bind if verify passed
 * @param {object}  - second object will bind if not passed
 */
module.exports = ({ query, condition } = {}, fail = {}) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      try {
        const { code, _id } = token.verify(
          req.headers.authorization,
          process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
        )

        const { authCode } = await User.findById(_id).select({ authCode: 1 })

        if (code === authCode) {
          req.queryOptions = Object.assign({}, { query }, { condition })
          return next()
        } else {
          req.queryOptions = fail
        }
      } catch (e) {
        req.queryOptions = fail
        return next()
      }
    }
    req.queryOptions = fail
    next()
  }
}
