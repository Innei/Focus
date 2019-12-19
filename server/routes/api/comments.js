const express = require('express')
const assert = require('http-assert')
const consola = require('consola')
const { Post, Option, Comment } = require('../../models/index')
const checkCommentsField = require('./../../middlewares/checkCommentField')()

const router = express.Router({
  mergeParams: true
})

router
  /**
   * 处理评论回复的路由
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
      ...req.body,
      hasParent: true
    }

    const query = await Comment.create(model)

    // parent.post.comments++
    // await parent.post.save()
    await parent.updateOne({
      // hasChild: true,
      $push: {
        children: query._id
      },
      $inc: {
        commentsIndex: 1
      }
    })

    res.send({ ok: 1, query })
  })

  .post('/:id', checkCommentsField, async (req, res) => {
    const body = req.body
    const pid = req.params.id

    // const comments = await Comment.countDocuments({
    //   pid,
    //   key: new RegExp(`^#\\d\\d\\d$`)
    // })

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
        consola.error(e)
        return res.status(500).send({ ok: 0, ...req.body })
      }
    } else {
      res.status(400).send({ ok: 0, msg: '被评论文章不存在' })
    }
  })
  /**
   * 获取评论各类型的数量的接口
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

  .put('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '无法修改空气哦')
    const state = Number(req.query.state)
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
      consola.error(e)
      return res.send({ ok: 0, msg: '参数不正确' })
    }
  })

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
          // if (query.hasChild) {
          delCount =
            (
              await Comment.deleteMany({
                key: new RegExp(`^${query.key}`, 'ig')
              })
            ).deletedCount + 1
          // }
        }

        return res.send({ ok: 1, n: 1, deleteCount: delCount || 1 })
      } catch (e) {
        consola.error(e)
        return res.send({ ok: 0, msg: '参数不正确' })
      }
    }
    return res.send({ ok: 0, msg: '请输入正确的ID' })
  })

module.exports = router
