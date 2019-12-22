const { Router } = require('express')
const assert = require('http-assert')
const { compareSync } = require('bcrypt')
const sanitize = require('mongo-sanitize')
const { randomStr } = require('../../utils/index')

const User = require('../../models/User')
const isMaster = require('../../middlewares/isMaster')

const router = Router()

router
  /**
   * Sign Up
   */
  .post('/signup', async (req, res) => {
    const { username, password, mail = '', url = '' } = req.body
    assert(username, 400, '用户名不能为空')
    // TODO 密码强弱判断
    assert(password, 400, '密码不能为空')

    // generate authCode when modify password.
    const authCode = randomStr()

    const doc = await User.create({
      username,
      password,
      mail,
      url,
      authCode
    })

    res.send({ ok: doc.ok, username: doc.username, id: doc._id })
  })
  /**
   * Login
   */
  .post(
    '/login',
    // 传入参数 获取状态 req.logged
    isMaster({ getStatus: true }),
    async (req, res) => {
      const { username, password } = req.body
      const cleanUsername = sanitize(username)
      assert(
        typeof cleanUsername === 'string' && cleanUsername,
        422,
        '君の名は'
      )
      assert(typeof password === 'string' && password, 422, 'えぃ')

      if (req.logged) {
        return res.send({ ok: 1, msg: '你已经登陆啦' })
      }

      const doc = await User.findOne({ username: cleanUsername }).select(
        '+password'
      )
      const verifyUsername = !!doc
      assert(verifyUsername, 400, '你不是我的主人')
      const verifyPass = compareSync(password, doc.password)
      assert(verifyPass, 400, '密码不对哦')

      const token = require('jsonwebtoken').sign(
        { _id: doc._id, User: username, code: doc.authCode },
        process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C',
        {
          expiresIn: `${process.env.MAXAGE || 3}d`
        }
      )
      doc.token = token
      await doc.save()

      res.send({ ok: 1, token })
    }
  )
  .get('/check_logged', isMaster({ getStatus: true }), async (req, res) => {
    res.send({ ok: 1, logged: req.logged })
  })
  /**
   * Modify password
   */
  .put('/password/modify', isMaster(), async (req, res) => {
    const { id, password, oldPassword } = req.body

    assert(id, 400, '标识符为空')
    assert(typeof password === 'string' && password, 400, '新密码不能为空')
    assert(typeof oldPassword === 'string' && oldPassword, 400, '密码不正确')
    assert(oldPassword !== password, 400, '新旧密码不能为空')
    // TODO 引入 zxc
    // if (process.env.NODE_ENV === 'production') {
    //   const zxc = require('zxcvbn')(password)
    //   if (zxc.score < 3) {
    //     return res.status(400).send({ ok: 0, msg: '密码设置过于简单' })
    //   }
    // }
    const user = await User.findOne().select('+password')
    // 验证匹配
    const verifyPass = compareSync(oldPassword, user.password)
    assert(verifyPass, 422, '密码不对哦')

    const doc = await User.updateOne(
      { _id: id },
      { password, authCode: randomStr() }
    )
    res.send({ ok: 1, msg: '修改成功', ...doc })
  })
  /**
   * Global Sign Out
   */
  .get('/sign_out', isMaster(), async (req, res) => {
    const id = req.user._id

    assert(id, 400, '没有用户需要注销')
    await User.updateOne(
      { _id: id },
      {
        authCode: randomStr()
      }
    )
    res.send({ ok: 1, msg: 'いってらっしゃい!' })
  })
  /**
   * Profile
   */
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, 'ID 为空')
    const r = await User.findById(id)
    res.send(r)
  })

module.exports = router
