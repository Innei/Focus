const { Router } = require('express')
const { Types } = require('mongoose')
const assert = require('http-assert')
const clean = require('mongo-sanitize')
const { Post, Category, Option } = require('../../models/index')
const isMaster = require('~/middlewares/isMaster')()
const checkPermissionToSee = require('~/middlewares/checkPermissionToSee')({
  condition: {}
})
const E = require('~/event/types')

const router = Router({ mergeParams: true })

router
  /**
   * 获取某分类下的某个 slug 的文章内容
   * @route GET /posts/{category}/{slug}
   * @param {string} category.path.required
   * @param {string} slug.path.required
   * @group 文章
   * @summary 获取某分类下的某个 slug 的文章内容
   * @returns {object} 200
   */
  .get('/:category/:slug', checkPermissionToSee, async (req, res) => {
    // 根据分类和 slug 查找, 因为 slug 是唯一键 所以其实 Category 不需要
    const { category, slug } = req.params
    const r = await Post.findOne({
      slug,
      ...(req.queryOptions?.condition || { hide: false })
    }).populate('categoryId')
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
      res.status(404).send({ ok: 0, msg: '不存在记录' })
    }
  })

  /**
   * 发布一篇文章
   * @route POST /posts/
   * @param {Post.model} post.body.required
   * @group 文章
   * @summary 发布一篇文章
   * @security JWT
   * @returns {object} 201
   */
  .post('/', isMaster, async (req, res) => {
    const body = req.body
    assert(body && body !== '{}', 400, '空的请求体')
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
    const options =
      body.options && typeof body.options === 'object'
        ? clean(body.options)
        : undefined
    if (categoryId) {
      const r = await Category.findById(categoryId)
      if (r) {
        r.count++
        await r.save()
      } else {
        return res.status(400).send({ ok: 0, msg: '分类不存在' })
      }
    }
    req.app.emit(E.default.CREATE_POST)
    const r = await Post.create({
      _id,
      title,
      text,
      status,
      summary,
      categoryId,
      slug,
      options
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

    res.status(201).send({ ok: 1, data: r })

    // sync to gist

    // if (gists) {

    //   req.app.emit(E.default.CREATE_POST, posts)
    // const syncRes = await gists.patchGist(posts, 'posts')
    // try {
    //   if (syncRes.ok) {
    //     req.app.get('ws').send(
    //       JSON.stringify({
    //         type: 'success',
    //         msg: syncRes.msg
    //       })
    //     )
    //   } else {
    //     req.app.get('ws').send(
    //       JSON.stringify({
    //         type: 'error',
    //         msg: `[${syncRes.code}] ${syncRes.msg}`
    //       })
    //     )
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
    // }
  })
  /**
   * 修改一篇文章
   * @route PUT /posts/{id}
   * @param {integer} id.path.required
   * @summary 修改一篇文章
   * @group 文章
   * @returns {Object} 200 { ok, data }
   */
  .put('/:id', isMaster, async (req, res) => {
    const { id } = req.params
    assert(id, 400, '标识符错误')
    const { title, slug, text, categoryId, status, summary } = req.body
    assert(slug && typeof slug === 'string', 400, '唯一路径为空')
    const options =
      req.body.options && typeof req.body.options === 'object'
        ? clean(req.body.options)
        : undefined
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
        categoryId,
        options
      },
      {
        // 未定义 undefined 不更新
        omitUndefined: true
      }
    )

    res.send({ ...r, msg: r.nModified ? '修改成功' : '没有文章被修改' })
  })

module.exports = router

/**
 * @typedef Post
 * @property {string} title.required
 * @property {string} text.required
 * @property {ObjectId} categoryId  - Mongoose ObjectId - eg: 5df3229fa3968d17e5763353
 * @property {string} summary
 * @property {string} slug
 */
