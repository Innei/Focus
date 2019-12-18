const { Router } = require('express')
const { Types } = require('mongoose')
const assert = require('http-assert')

const { Post, Category, Option } = require('../../models/index')
const router = Router({ mergeParams: true })

router
  // TODO 自动生成 summary
  // 根据分类和 slug 查找, 因为 slug 是唯一键 所以其实 Category 不需要
  .get('/:category/:slug', async (req, res) => {
    const { category, slug } = req.params
    const r = await Post.findOne({ slug }).populate('categoryId')
    if (r) {
      res.send({
        ok: 1,
        path: `${
          !r.categoryId
            ? 'null'
            : r.categoryId.name === category
            ? r.categoryId.name
            : 'null'
        }/${slug}`,
        ...r.toObject()
      })
    } else {
      res.send({ ok: 0, msg: '不存在记录' })
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
      summary,
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
      summary,
      categoryId,
      slug
    })

    await Option.updateOne(
      {
        name: 'count'
      },
      {
        $inc: {
          'value.postCount': 1
        }
      }
    )

    res.send({ ok: 1, data: r })
  })
  .put('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, 400, '标识符错误')
    const { title, slug, text, categoryId, status, summary } = req.body
    const origin = await Post.findById(id)
    assert(origin, 400, '需要修改的对象不存在')
    // 更新分类信息
    if (categoryId && categoryId !== origin.categoryId) {
      const originCategory = await Category.findById(origin.categoryId)
      const newCategory = await Category.findById(categoryId)
      if (originCategory) {
        originCategory.count--
        await originCategory.save()
      }
      if (newCategory) {
        newCategory.count++
        await newCategory.save()
      }
    }
    const r = await Post.updateOne(
      { _id: id },
      {
        title,
        slug,
        text,
        status,
        summary,
        categoryId
      },
      {
        // 未定义 undefined 不更新
        omitUndefined: true
      }
    )

    res.send({ ...r, msg: r.nModified ? '修改成功' : '没有文章被修改' })
  })

module.exports = router
