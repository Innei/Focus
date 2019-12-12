const { Router } = require('express')
const assert = require('http-assert')

const isMater = require('../../middlewares/isMaster')
const Category = require('../../models/Category')

const router = Router()

router

  // 使用 /rest/ 整合
  // .get('/', async (req, res) => {
  //   const r = await Category.find()
  //   res.send({ ok: 1, count: r.length, data: r })
  // })
  // .get('/:id', async (req, res) => {
  //   const { id } = req.params
  //   assert(id, 400, '缺少唯一标志符')
  //   const r = await Category.findById(id)
  //   r
  //     ? res.send({ ok: 0, msg: '找不到相关的记录' })
  //     : res.send({ ok: 1, data: r })
  // })
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
    try {
      const r = await Category.create({
        name,
        type,
        slug
      })
      res.send({ ok: 1, r })
    } catch (e) {
      return res.send({ ok: 0, msg: e.errors.slug.message })
    }
  })
  // 修改分类
  .put('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '标识符为空')
    const { slug, name } = req.body
    const r = await Category.updateOne(
      { _id: id },
      {
        slug,
        name
      },
      { omitUndefined: true }
    )

    res.send({ ...r, msg: r.nModified ? '修改成功' : '修改失败' })
  })
module.exports = router
