const { Router } = require('express')
const assert = require('http-assert')
const { compareSync } = require('bcrypt')
const sanitize = require('mongo-sanitize')
const { randomStr } = require('../../utils')

const User = require('../../models/User')
const isMaster = require('../../middlewares/isMaster')

const router = Router()

router
  /**
   * Sign Up
   * @route POST /master/sign_up
   * @summary 注册 (初始化时使用)
   * @group 主人
   * @param {User.model} user.body.required
   * @returns {object} 200 - data | msg
   */

  .post('/sign_up', async (req, res) => {
    const { username, password, mail = '', url = '' } = req.body
    assert(username, 400, '用户名不能为空')
    assert(password, 400, '密码不能为空')
    // TODO 密码强弱判断

    if (process.env.NODE_ENV === 'production') {
      const { checkPassword } = require('../../utils')
      if (checkPassword(password) < 3) {
        return res.status(400).send({ ok: 0, msg: '密码设置过于简单' })
      }
    }

    // generate authCode when modify password.
    const authCode = randomStr()

    const doc = await User.create({
      username,
      password,
      mail,
      url,
      authCode
    })

    res.send({ ok: 1, username: doc.username, id: doc._id })
  })
  /**
   * Login
   * @route POST /master/login
   * @summary 登陆
   * @group 主人
   * @param {Login.model} user.body.required
   * @returns {object} 200 - token
   */
  .post(
    '/login',
    // 传入参数 获取状态 req.logged
    isMaster({ getStatus: true }),
    async (req, res) => {
      if (req.logged) {
        return res.send({ ok: 1, msg: '你已经登陆啦' })
      }
      const { username, password } = req.body
      const cleanUsername = sanitize(username)
      assert(
        typeof cleanUsername === 'string' && cleanUsername,
        422,
        '君の名は'
      )
      assert(typeof password === 'string' && password, 422, 'えぃ')

      const doc = await User.findOne({ username: cleanUsername }).select(
        '+password +authCode'
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
  /**
   * Check logged
   * @route GET /master/check_logged
   * @group 主人
   * @summary 判断是否登录
   * @returns {Logged.model} 200
   */
  .get('/check_logged', isMaster({ getStatus: true }), async (req, res) => {
    res.send({ ok: 1, logged: req.logged })
  })
  /**
   * Modify password
   *
   */
  .put('/password/modify', isMaster(), async (req, res) => {
    const { id, password, oldPassword } = req.body

    assert(id, 400, '标识符为空')
    assert(typeof password === 'string' && password, 400, '新密码不能为空')
    assert(typeof oldPassword === 'string' && oldPassword, 400, '密码不正确')
    assert(oldPassword !== password, 400, '新旧密码不能为空')

    if (process.env.NODE_ENV === 'production') {
      const { checkPassword } = require('../../utils')
      if (checkPassword(password) < 3) {
        return res.status(400).send({ ok: 0, msg: '密码设置过于简单' })
      }
    }
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
   * @route GET /master/sign_out
   * @summary 全局注销用户
   * @group 主人
   * @returns {object} 200 ok & msg
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
/**
 * @typedef User
 * @property {string} username.required
 * @property {string} password.required
 * @property {string} mail
 * @property {string} url
 */

/**
 * @typedef Login
 * @property {string} username.required
 * @property {string} password.required
 */

/**
 * @typedef Logged
 * @property {integer} ok
 * @property {boolean} logged
 */
