const { Router } = require('express')
const assert = require('http-assert')
const { User, Option } = require('./../../models/index')
const router = new Router()

router
  /**
   * 前端渲染前获取的配置
   * @route GET /config
   * @summary 前端渲染前获取的配置
   * @group 配置
   * @returns { ok, data } 200
   */
  .get('/', async (req, res) => {
    const user = await User.findOne().select('username mail url')
    assert(user, 400, '用户没有完成初始化')
    const option = await Option.find({
      $or: [
        {
          name: 'title'
        },
        {
          name: 'keywords'
        },
        {
          name: 'desc'
        },
        {
          name: 'createdDay'
        }
      ]
    }).select('name value')

    const parsed = {}
    option.forEach((item) => {
      parsed[item.name] = item.value
    })

    res.send({
      ok: 1,
      config: {
        ...user.toObject(),
        ...parsed,
        avatar: `https://www.gravatar.com/avatar/${require('../../utils').md5(
          user.mail
        )}`
      }
    })
  })
  /**
   * 安装和初始化接口
   * @route PUT /config/init
   * @group 配置
   * @summary 安装和初始化接口
   * @param {Init.model} init.body.required
   * @returns {object} 200
   *
   */
  .put(
    '/init',
    async (req, res, next) => {
      const { value } = await Option.findOne({
        name: 'installed'
      })
      assert(!value, 422, '已经完成初始化.')
      next()
    },
    async (req, res) => {
      const body = req.body
      assert(body, 400, '请求体为空')
      if (body.host && body.protocol && !body.domain) {
        body.domain = body.protocol + body.host
      }
      if (
        body.keywords &&
        body.keywords.length &&
        Array.isArray(body.keywords) === true
      ) {
        body.keywords = body.keywords.join(',')
      } else body.keywords = undefined
      const names = ['title', 'desc', 'keywords', 'domain']
      // names.forEach(async (item) => {

      // })
      // let completed = false

      for (const name of names) {
        try {
          await Option.updateOne(
            { name },
            { value: body[name] },
            { omitUndefined: true }
          )
        } catch (err) {
          return res.status(422).send({ ok: 0, msg: '出现了异常' })
        }
      }
      await Option.updateOne(
        {
          name: 'installed'
        },
        {
          $set: {
            value: 1
          }
        },
        { upsert: true }
      )
      res.send({ ok: 1, msg: '初始化成功啦~' })
    }
  )

/**
 * @typedef Init
 * @property {string} title - 标题
 * @property {string} desc - 描述
 * @property {Array} keywords - 关键词
 * @property {string} domain - 域名
 */
module.exports = router
