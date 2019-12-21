const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { getClientIP } = require('../utils')
/**
 * 检查评论中是否存在 {author, content, email, pid}
 */
module.exports = (options) => {
  return async (req, res, next) => {
    const token = req.headers['authorization']
    if (!req.params.id && !req.params.cid) {
      return res.status(422).send({ msg: '评论文章不能为空' })
    }
    const body = req.body
    if (!body.author) {
      return res.status(422).send({ msg: '姓名不能为空' })
    } else {
      const isExist = !!(await User.findOne({ username: body.author }))
      if (isExist && !token) {
        return res.status(422).send({ msg: '该用户名已被占用' })
      }
    }
    if (!body.content) {
      return res.status(422).send({ msg: '内容不能为空' })
    }
    if (!body.mail) {
      return res.status(422).send({ msg: '邮箱不能为空' })
    }
    if (!body.text) {
      return res.status(422).send({ msg: '评论内容不能为空' })
    }

    /*  if (!token) {
      req.body.isOwner = false
    } else {
      try {
        const obj = jwt.verify(
          token,
          process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
        )
        const id = obj.id
        const model = await User.findById(id)
        if (model && model.username) {
          req.body.isOwner = model.username === body.author ? true : false
          req.body.state = req.body.isOwner ? 1 : 0
        }
      } catch (e) {
        return res.status(500).send({
          msg: '发生错误',
          ok: 0
        })
      }
    } */
    req.body.agent = req.useragent.source
    req.body.ip = getClientIP(req)
    await next()
  }
}
