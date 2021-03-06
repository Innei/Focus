const express = require('express')
const assert = require('http-assert')
const clean = require('mongo-sanitize')
const { Types } = require('mongoose')
const { Post, Option, Comment } = require('../../models/index')
const checkCommentsField = require('./../../middlewares/checkCommentField')()

const router = express.Router({
  mergeParams: true
})
/**
 * @typedef Comment
 * @property {string} author
 * @property {string} text
 * @property {string} mail
 * @property {string} url
 */
router
  /**
   * 根据文章 ID 获取评论列表
   * @route GET /comments/post/{cid}
   * @group 评论
   * @summary 根据文章 ID 获取评论列表
   * @param {ObjectId} pid.path.required
   * @returns {object} 200 | 400
   */
  .get('/post/:pid', async (req, res) => {
    const { pid } = req.params
    assert(pid && Types.ObjectId.isValid(pid), 422, '请求不正确')
    const comments = await Comment.find({
      hasParent: false,
      pid
    })
    res.send({ ok: 1, data: comments })
  })
  /**
   * 处理评论回复的路由
   * @route POST /comments/reply/{cid}
   * @group 评论
   * @summary 处理评论回复的路由
   * @param {ObjectId} cid.path.required
   * @param {Comment.model} comment.body.required
   * @returns {object} 200 | 400
   */
  .post('/reply/:cid', checkCommentsField, async (req, res) => {
    // 父ID
    const cid = req.params.cid
    assert(cid, 400, '错误的请求')
    const parent = await Comment.findById(cid).populate('pid')
    assert(parent, 400, '不存在父评论')

    const commentsPatents = parent.commentsIndex
    req.body.key = parent.key + `#${commentsPatents + 1}`

    const model = {
      parent,
      pid: parent.pid._id,
      ...clean(req.body),
      hasParent: true
    }

    const query = await Comment.create(model)
    await parent.updateOne({
      $push: {
        children: query._id
      },
      $inc: {
        commentsIndex: 1
      }
    })

    res.send({ ok: 1, query })
  })
  /**
   * 评论接口
   * @route POST /comments/{id}
   * @group 评论
   * @param {ObjectId} id.path.required - 文章的 ObjectId
   * @summary 评论接口
   * @returns {object} 200 - eg: { ok, data}
   */
  .post('/:id', checkCommentsField, async (req, res) => {
    const body = req.body
    const pid = req.params.id

    const post = await Post.findById(pid)
    const comments = post.commentsIndex
    body.key = `#${comments + 1}`

    if (post) {
      const query = await Comment.create({ ...body, pid: post._id })
      try {
        // 增加Post中的索引
        await post.updateOne({
          $inc: {
            commentsIndex: 1
          }
        })

        await Option.updateOne(
          { name: 'count' },
          {
            $inc: {
              'value.commentCount': 1
            }
          }
        )

        return res.send({
          ok: 1,
          ...query.toObject()
        })
      } catch (e) {
        return res.status(500).send({ ok: 0, ...req.body })
      }
    } else {
      res.status(400).send({ ok: 0, msg: '被评论文章不存在' })
    }
  })
  /**
   * 获取评论各类型的数量的接口
   * @route GET /comments/info
   * @summary 获取评论各类型的数量的接口
   * @group 评论
   * @returns {object} 200 - eg: { ok: 1, passed: 1, gomi: 1, needChecked: 1}
   */
  .get('/info', async (req, res) => {
    const passed = await Comment.countDocuments({
      state: 1
    })
    const gomi = await Comment.countDocuments({ state: 2 })
    const needChecked = await Comment.countDocuments({
      state: 0
    })

    res.send({
      ok: 1,
      passed,
      gomi,
      needChecked
    })
  })
  /**
   * 修改评论的状态
   * @route PUT /comments/{id}
   * @summary 修改评论的状态
   * @param {ObjectId} id.path.required
   * @param {integer} state.body.required
   * @group 评论
   * @returns {object} 200
   */
  .put('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '无法修改空气哦')
    const state = parseInt(req.query.state)
    assert(state, 400, '缺少要素')

    try {
      const query = await Comment.updateOne(
        {
          _id: id
        },
        { state }
      )

      return res.send(query)
    } catch (e) {
      return res.status(400).send({ ok: 0, msg: '参数不正确' })
    }
  })
  /**
   * 删除一条评论，子评论同时被删除
   * @route DELETE /comments/{id}
   * @summary 删除一条评论
   * @param {ObjectId} id.path.required
   * @group 评论
   * @returns {object} 200 | 400
   */
  .delete('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '无法删除空气哦')

    if (id) {
      let delCount
      try {
        const query = await Comment.findOneAndDelete({
          _id: id
        })

        if (query && query.children && query.children.length) {
          delCount =
            (
              await Comment.deleteMany({
                key: new RegExp(`^${query.key}`, 'ig')
              })
            ).deletedCount + 1
        }

        return res.send({ ok: 1, n: 1, deleteCount: delCount || 1 })
      } catch (e) {
        return res.status(400).send({ ok: 0, msg: '参数不正确' })
      }
    }
    return res.status(400).send({ ok: 0, msg: '请输入正确的ID' })
  })

module.exports = router
