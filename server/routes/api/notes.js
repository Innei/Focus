const { Router } = require('express')
const { Types } = require('mongoose')
const assert = require('http-assert')

const { Post, Category, Option } = require('../../models/index')
const router = Router()

router
  .post('/', async (req, res) => {
    const body = req.body
    assert(body && body != '{}', 400, '空的请求体')
    // 提前生成一个 ObjectId, 取代未定义的 slug
    const _id = Types.ObjectId()
    const {
      title = '未命名文章',
      text = '',
      status,
      categoryId,
      authorId,
      slug = _id
    } = body

    if (categoryId) {
      const r = await Category.findById(categoryId)
      if (r) {
        r.count++
        await r.save()
      } else {
        return res.status(400).send({ ok: 0, msg: '分类不存在' })
      }
    }

    const r = await Post.create({
      _id,
      title,
      text,
      status,
      categoryId: Types.ObjectId(categoryId),
      authorId,
      slug
    })

    res.send(r)
  })
  .put('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, 400, '标识符错误')
    const { title, slug, text, categoryId, status } = req.body
    const origin = await Post.findById(id)
    assert(origin, 400, '需要修改的对象不存在')
    // 更新分类信息
    if (categoryId && categoryId !== origin.categoryId) {
      const originCategory = await Category.findById(origin.categoryId)
      const newCategory = await Category.findById(categoryId)
      originCategory.count--
      await originCategory.save()
      newCategory.count++
      await newCategory.save()
    }
    const r = await Post.updateOne(
      { _id: id },
      {
        modifiedTime: new Date(),
        title,
        slug,
        text,
        status,
        categoryId: Types.ObjectId(categoryId)
      },
      {
        // 未定义 undefined 不更新
        omitUndefined: true
      }
    )

    res.send({ ...r, msg: r.nModified ? '修改成功' : '修改失败' })
  })

module.exports = router
