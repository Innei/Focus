module.exports = (options = {}) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      try {
        const { code, _id, User } = require('jsonwebtoken').verify(
          req.headers.authorization,
          process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
        )
        // mount _id
        req.user = { _id, User }
        // console.log(_id);

        const { authCode } = await require('../models/User')
          .findById(_id)
          .select({ authCode: 1 })

        if (code === authCode) {
          if (options.getStatus) {
            req.logged = 1
          }
          return next()
        } else {
          if (options.getStatus) {
            req.logged = 0
            return next()
          }
          return res
            .status(options.status || 401)
            .send({ ok: 0, msg: 'Token 已过期' })
        }
      } catch (e) {
        console.log(e)
        return res.status(500).send({ ok: 0, msg: 'Error in parse token' })
      }
    }
    if (options.getStatus) {
      req.logged = 0
      return next()
    }
    return res.status(options.status || 401).send({ ok: 0, msg: '请先登录' })
  }
}
