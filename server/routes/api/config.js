const { Router } = require('express')
const { User, Option } = require('./../../models/index')
const assert = require('http-assert')
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
      parsed[item['name']] = item['value']
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

module.exports = router
