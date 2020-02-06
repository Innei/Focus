const Router = require('@koa/router')
const assert = require('http-assert')
const clean = require('mongo-sanitize')
const { User, Option, Menu } = require('./../../models/index')

const router = new Router({
  prefix: '/config'
})

router
  /**
   * 前端渲染前获取的配置
   * @route GET /config
   * @summary 前端渲染前获取的配置
   * @group 配置
   * @returns { ok, data } 200
   */
  .get('/', async ({ request, response }) => {
    const user = await User.findOne().select(
      'username mail url name lastLoginTime'
    )
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
    const menus = await Menu.find()

    const parsed = {}
    option.forEach((item) => {
      parsed[item.name] = item.value
    })

    response.body = {
      ok: 1,
      menus,
      config: {
        ...user.toObject(),
        ...parsed,
        avatar: `https://www.gravatar.com/avatar/${require('../../utils').md5(
          user.mail
        )}`
      }
    }
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
    async ({ request, response, next }) => {
      const { value } = await Option.findOne({
        name: 'installed'
      })
      assert(!value, 422, '已经完成初始化.')
      next()
    },
    async ({ request, response }) => {
      const body = request.body
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
          response.status = 422
          response.body = { ok: 0, msg: '出现了异常' }
          return
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
      response.body = { ok: 1, msg: '初始化成功啦~' }
    }
  )

  .post('/menus', async ({ request, response }) => {
    const { type, title, order = 0 } = request.body

    const [icon, options] = [
      clean(request.body.icon),
      clean(request.body.options)
    ]

    assert(title, 422, '菜单标题不能为空')
    assert(type, 422, '菜单类型不能为空')

    const Types = ['Note', 'Post', 'Timeline', 'Home', 'Moment']
    assert(Types.includes(type), 422, '菜单类型不正确')

    const query = await Menu.create({ title, order, options, icon, type })

    response.body = { ok: 1, data: query }
  })

/**
 * @typedef Init
 * @property {string} title - 标题
 * @property {string} desc - 描述
 * @property {Array} keywords - 关键词
 * @property {string} domain - 域名
 */
module.exports = router.routes()
