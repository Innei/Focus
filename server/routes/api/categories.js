const { Router } = require('express')
const assert = require('http-assert')

const isMater = require('../../middlewares/isMaster')
const Category = require('../../models/Category')

const router = Router()

router
  .get('/', async (req, res) => {
    const r = await Category.find()
    res.send(r)
  })
  /**
   * 创建一个分类
   */
  .post('/', async (req, res) => {
    const { name, type } = req.body
    assert(name, 400, '分类名称不能为空')
    // type: Category | Tag
    if (type && (type !== 'Category' || type !== 'Tag')) {
      return res.status(400).send({ ok: 0, msg: '类型不正确' })
    }
    const { slug = name } = req.body
  })
module.exports = router
