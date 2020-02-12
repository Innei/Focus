const { Router } = require('express')
const assert = require('http-assert')
const { Types } = require('mongoose')
const { hashSync } = require('bcrypt')

const { Note, Option } = require('../../models/index')
const isMaster = require('~/middlewares/isMaster')()
const checkPermissionToSee = require('~/middlewares/checkPermissionToSee')(
  {
    condition: {}
  },
  { condition: { hide: false } }
)

const router = Router()

router
  /**
   * 获取最新发布一篇随记
   * @route GET /notes/lastest
   * @summary 获取最新发布一篇随记
   * @group 随记
   * @returns {object} 200 - data | msg
   */

  .get('/lastest', checkPermissionToSee, async (req, res) => {
    const r = await Note.findOne(
      req.queryOptions?.condition || { hide: false }
    ).sort({
      created: -1
    })
    if (r) {
      req.header('Referrer') ? r.count.read++ : null
      await r.save()

      // 是否存在上一条记录 (旧记录)
      // 统一: next 为较老的记录  prev 为较新的记录
      const next = await Note.findOne({
        _id: {
          $lt: r._id
        },
        ...(req.queryOptions?.condition || { hide: false })
      })
        .sort({ _id: -1 })
        .select('nid _id')
      return res.send({ ok: 1, data: r, next })
    }
    res.status(400).send({ ok: 0, msg: '作者还没有发布一篇随记!' })
  })
  /**
   * 以一篇随记为基准的中间 10 篇随记
   * @route GET /notes/list/{nid}
   * @summary 以一篇随记为基准的中间 10 篇随记, 可指定数量
   * @param {integer} size.query
   * @param {integer} nid.path.required
   * @group 随记
   * @returns {object} 200 - data | msg
   */
  .get('/list/:id', async (req, res) => {
    const { size = 10 } = req.query
    const { id } = req.params
    assert(id, 400, '不正确的请求')
    const select = 'nid _id title created'
    const sort = { nid: -1, _id: -1 }
    // NoSql inject NaN limit => 0
    const limit = parseInt(size / 2)
    const hide = req.queryOptions?.condition || { hide: false }
    const prevList = Types.ObjectId.isValid(id)
      ? await Note.find({
          _id: {
            $gte: id
          },
          ...hide
        }).setOptions({ select, limit: limit || 5 })
      : await Note.find({
          nid: {
            $gte: id
          },
          ...hide
        }).setOptions({ select, limit: limit || 5 })

    const nextList = Types.ObjectId.isValid(id)
      ? await Note.find({
          _id: {
            $lt: id
          },
          ...hide
        }).setOptions({ select, limit: parseInt(size) - prevList.length, sort })
      : await Note.find({
          nid: {
            $lt: id
          },
          ...hide
        }).setOptions({ select, limit: parseInt(size) - prevList.length, sort })

    const list = nextList.reverse().concat(prevList)
    list.length > 0
      ? res.send({
          ok: 1,
          page: { size: list.length },
          data: list
        })
      : res.status(422).send({ ok: 0, msg: '没有更多文章' })
  })
  /**
   * 获取一篇随记
   * @route GET /notes/{id}
   * @summary 获取一篇随记
   * @param {ObjectId | integer} id.path.required - eg: 12
   * @group 随记
   * @security JWT
   * @returns {object} 200 - data | msg
   */
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '不正确的请求')
    const hide = req.queryOptions?.condition || { hide: false }
    const r = await Note.findOne({
      [Types.ObjectId.isValid(id) ? '_id' : 'nid']: id,
      ...hide
    })
    if (r) {
      req.header('Referrer') ? r.count.read++ : null
      await r.save()
      // 获取 nid 的下一条和上一条记录
      const prev = await Note.findOne({
        _id: {
          $gt: r._id
        },
        ...hide
      })

      const next = await Note.findOne({
        _id: {
          $lt: r._id
        },
        ...hide
      }).sort({ _id: -1 })
      res.send({ ok: 1, data: r, prev, next })
    } else {
      res.status(400).send({ ok: 0, msg: '不存在此记录' })
    }
  })

  /**
   * 发布一篇随记
   * @route POST /notes
   * @summary 发布一篇随记
   * @group 随记
   * @param {Note.model} note.body.required
   * @returns {object} 200 - data | msg
   * @security JWT
   */
  .post('/', isMaster, async (req, res) => {
    const body = req.body
    assert(body && body !== '{}', 400, '空的请求体')

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
  /**
   * 修改一篇随记
   * @route PUT /notes/{id}
   * @param {integer | ObjectId} id.path.required
   * @summary 修改一篇随记
   * @param {Note.model} note.body.required
   * @group 随记
   * @returns {Object} 200 { ok }
   */
  .put('/:id', isMaster, async (req, res) => {
    const { id } = req.params
    assert(id, 400, '标识符错误')
    const { title, text, mood, weather, password, hide } = req.body

    const r = await Note.updateOne(
      { [Types.ObjectId.isValid(id) ? '_id' : 'nid']: id },
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

/**
 * @typedef Note
 * @property {string} title
 * @property {string} text.required
 * @property {string} mood - 心情
 * @property {string} weather - 天气
 * @property {string} password
 * @property {boolean} hide - default: false
 * @property {string} summary
 */
