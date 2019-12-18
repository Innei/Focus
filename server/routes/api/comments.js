const express = require('express')
const asset = require('http-assert')
const consola = require('consola')
const { Post, Option, Comment } = require('../../models/index')
const checkCommentsField = require('./../../middlewares/checkCommentField')()

const router = express.Router({
  mergeParams: true
})

router.post('/:id', checkCommentsField, async (req, res) => {
  const body = req.body
  const pid = req.params.id

  const comments = await Comment.countDocuments({
    pid,
    key: new RegExp(`^#\\d\\d\\d$`)
  })

  body.key = `#${String(comments + 1).padStart(3, 0)}`
  const post = await Post.findById(pid)

  if (post) {
    const query = await Comment.create({ ...body, pid: post._id })
    try {
      // 增加Post中的数量
      await post.updateOne({
        $inc: {
          commentsNum: 1
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

module.exports = router
