const { Router } = require('express')
const assert = require('http-assert')
const { Types } = require('mongoose')
const isMater = require('../../middlewares/isMaster')()
const { Category, Post } = require('../../models')

const router = Router()

router

  // 使用 /rest/ 整合

  /**
   * 创建一个分类
   */
  .post('/', isMater, async (req, res) => {
    const { name, type = 'Category' } = req.body
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
  .put('/:id', isMater, async (req, res) => {
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
  // .get('/slug/:name', async (req, res) => {
  //   const name = req.params.name
  //   assert(name, 400, '不正确的 slug')
  //   const
  // })
  .get('/:query', async (req, res) => {
    const query = req.params.query
    assert(query, 400, '不正确的请求')
    const isId = Types.ObjectId.isValid(query)

    const r = isId
      ? await Category.findById(query).sort({ created: -1 })
      : await Category.findOne({ slug: query }).sort({ created: -1 })
    if (r) {
      if (r.count) {
        const children = await Post.find({ categoryId: r._id })
          .select('title created slug')
          .sort({ created: -1 })
        return res.send({ ok: 1, data: { ...r.toObject(), children } })
      }
      res.send({ ok: 1, data: r })
    } else {
      res.send({ ok: 0, msg: '不存在此记录' })
    }
  })
module.exports = router
