const { Router } = require('express')
const { Types } = require('mongoose')
const assert = require('http-assert')

const { Post, Category, Option } = require('../../models/index')
const router = Router()

router
  /**
   * 获取最近文章的接口
   */
  .get('/', async (req, res) => {
    const { page = 1, size = 10 } = req.query
    assert(size < 20, 400, '要素过多')
    assert(page > 0, 400, '页数不正确')
    const data = await Post.find({})
      .skip((page - 1) * size)
      .limit(Number(size))
      .sort({ createdTime: -1 })
    if (data.length === 0) {
      return res.send({ ok: 0, msg: '没有下页啦!' })
    }
    const total = await Post.countDocuments()
    const totalPage = Math.ceil(total / size)
    const pageOptions = {
      size: data.length,
      currentPage: Number(page),
      totalPage,
      total,
      hasNextPage: totalPage > page,
      hasPrevPage: Number(page) !== 1
    }

    res.send({
      ok: 1,
      page: pageOptions,
      data
    })
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '不正确的请求')
    const r = await Post.findById(id).populate('categoryId')
    if (r) {
      res.send(r)
    } else {
      res.send({ ok: 0, msg: '不存在此文章' })
    }
  })
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

    res.send(r)
  })
  .delete('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, 400, '记录不存在')
    // TODO 优化返回内容
    res.send(await Post.deleteOne({ _id: id }))
  })
module.exports = router
