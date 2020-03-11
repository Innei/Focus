const { Router } = require('express')
const { Types } = require('mongoose')
const assert = require('http-assert')
const { compareSync } = require('bcrypt')
const sanitize = require('mongo-sanitize')
const nanoid = require('nanoid')
const { getAvatar, getClientIP } = require('../../utils/')
const { User, Post, Note } = require('~/models')
const isMaster = require('~/middlewares/isMaster')
const checkToken = require('~/middlewares/checkToken')

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
    assert(!(await User.countDocuments()), 422, '我只能有一个主人哦~')

    const { username, password, mail = '', url = '' } = req.body
    const { name = username } = req.body
    assert(username, 400, '用户名不能为空')
    assert(typeof username === 'string', 400, '用户名必须为字符串')
    assert(typeof password === 'string', 400, '密码必须为字符串')
    // TODO 密码强弱判断

    if (process.env.NODE_ENV === 'production') {
      const { checkPassword } = require('../../utils')
      if (checkPassword(password) < 3) {
        return res.status(422).send({ ok: 0, msg: '密码设置过于简单' })
      }
    }

    // generate authCode when modify password.
    const authCode = nanoid(10)

    const doc = await User.create({
      username,
      password,
      name,
      mail,
      url,
      authCode
    })

    res.send({ ok: 1, username: doc.username, name, id: doc._id })
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
    checkToken({ getStatus: true }),
    async (req, res) => {
      if (req.logged) {
        return res.send({ ok: 1, msg: '你已经登陆啦' })
      }
      const { username, password } = req.body
      const cleanUsername = sanitize(username)
      assert(
        typeof cleanUsername === 'string' && cleanUsername,
        400,
        '君の名は'
      )
      assert(typeof password === 'string' && password, 400, 'えぃ')

      const doc = await User.findOne({ username: cleanUsername }).select(
        '+password +authCode'
      )
      const verifyUsername = !!doc
      assert(verifyUsername, 422, '你不是我的主人')
      const verifyPass = compareSync(password, doc.password)
      assert(verifyPass, 422, '密码不对哦')

      const token = require('jsonwebtoken').sign(
        { _id: doc._id, username, code: doc.authCode },
        process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C',
        {
          expiresIn: `${process.env.MAXAGE || 3}d`
        }
      )
      const { lastLoginTime, lastLoginIp, _id } = doc.toObject()
      doc.lastLoginTime = new Date()
      doc.lastLoginIp = getClientIP(req)
      await doc.save()
      res.send({
        ok: 1,
        token,
        expires: process.env.MAXAGE || 3,
        id: _id,
        lastLoginIp,
        lastLoginTime
      })
    }
  )
  /**
   * Check logged
   * @route GET /master/check_logged
   * @group 主人
   * @summary 判断是否登录
   * @security JWT
   * @returns {Logged.model} 200
   */
  .get('/check_logged', checkToken())
  /**
   * Modify password
   *
   */
  .put('/password/modify', isMaster(), async (req, res) => {
    const { id, password, oldPassword } = req.body

    assert(id, 400, '标识符为空')
    assert(typeof password === 'string' && password, 400, '新密码不能为空')
    assert(typeof oldPassword === 'string' && oldPassword, 400, '密码不正确')
    assert(oldPassword !== password, 400, '新旧密码不能相同')

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
      { password, authCode: nanoid(10) }
    )
    res.send({ ok: 1, msg: '修改成功', ...doc })
  })
  /**
   * Global Sign Out
   * @route GET /master/logout
   * @summary 全局注销用户
   * @group 主人
   * @security JWT
   * @returns {object} 200 ok & msg
   */
  .get('/logout', isMaster(), async (req, res) => {
    const id = req.user._id

    assert(id, 400, '没有用户需要注销')
    await User.updateOne(
      { _id: id },
      {
        authCode: nanoid(10)
      }
    )
    res.send({ ok: 1, msg: 'いってらっしゃい!' })
  })
  /**
   * Profile
   * @summary 获取主人的信息
   * @group 主人
   * @returns {object} 200 ok & data
   */
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(
      id && typeof id === 'string' && Types.ObjectId.isValid(id),
      400,
      'ID 为空'
    )
    const query = await User.findById(id)
    const count = {
      post: await Post.countDocuments(),
      note: await Note.countDocuments()
    }
    const avatar = getAvatar(query.mail)
    const data = Object.assign(query.toObject(), { count }, { avatar })
    res.send({ ok: 1, data })
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
