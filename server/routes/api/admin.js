const { Router } = require('express')
const assert = require('http-assert')
const { User, Option, Post, Comment, Note } = require('./../../models/index')
const isMaster = require('../../middlewares/isMaster')()
const Admin = new Router()
Admin.use(isMaster)

Admin.get('/dashboard', async (req, res) => {
  const posts = await Post.countDocuments()
  const notes = await Note.countDocuments()
  const comments = await Comment.countDocuments()

  res.send({
    ok: 1,
    num: { posts, notes, comments }
  })
})

module.exports = Admin
