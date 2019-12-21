const { Router } = require('express')
const assert = require('http-assert')
const { Types } = require('mongoose')
const { hashSync } = require('bcrypt')

const { Note, Option } = require('../../models/index')
const router = Router()

router
  .get('/lastest', async (req, res) => {
    const r = await Note.findOne().sort({ created: -1 })
    if (r) {
      r.count.read++
      await r.save()
      return res.send({ ok: 1, data: r })
    }
    res.send({ ok: 0, msg: '作者还没有发布一篇随记!' })
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '不正确的请求')
    const isId = Types.ObjectId.isValid(id)
    const r = isId ? await Note.findById(id) : await Note.findOne({ nid: id })

    if (r) {
      r.count.read++
      await r.save()
      res.send({ ok: 1, data: r })
    } else {
      res.send({ ok: 0, msg: '不存在此记录' })
    }
  })

  .post('/', async (req, res) => {
    const body = req.body
    assert(body && body != '{}', 400, '空的请求体')

    const { title = '无题', text = '', mood, weather, hide, password } = body
    // let { password } = body

    const count = await Option.findOne({ name: 'count' })
    const value = count.value
    const nid = value.noteCount + 1

    const r = await Note.create({
      nid,
      title,
      text,
      mood,
      weather,
      hide,
      password: password ? hashSync(password, 6) : undefined
    })
    await count.updateOne({
      $inc: {
        'value.noteCount': 1
      }
    })
    res.send(r)
  })
  .put('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, 400, '标识符错误')
    const { title, text, mood, weather, password, hide } = req.body

    const r = await Note.updateOne(
      { _id: id },
      {
        // modified: new Date(),
        title,
        text,
        hide,
        weather,
        password,
        mood
      },
      {
        // 未定义 undefined 不更新
        omitUndefined: true
      }
    )

    res.send({ ...r, msg: r.nModified ? '修改成功' : '没有随记被修改' })
  })

module.exports = router
