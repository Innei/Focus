const { Router } = require('express')
const { User, Option } = require('./../../models/index')
const assert = require('http-assert')
const router = new Router()

router.get('/', async (req, res) => {
  const user = await User.findOne().select('created username mail url')
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

  res.send({ ok: 1, config: { ...user.toObject(), ...parsed } })
})

module.exports = router
