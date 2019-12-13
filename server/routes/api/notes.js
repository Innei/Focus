const { Router } = require('express')
const assert = require('http-assert')

const { Note, Option } = require('../../models/index')
const router = Router()

router
  .post('/', async (req, res) => {
    const body = req.body
    assert(body && body != '{}', 400, '空的请求体')

    const {
      title = '未命名随记',
      text = '',
      mood,
      weather,
      hide,
      password
    } = body
    // let { password } = body

    const { value } = await Option.find({ name: 'count' })
    const nid = value.noteCount + 1

    const r = await Note.create({
      nid,
      title,
      text,
      mood,
      weather,
      hide,
      password
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
