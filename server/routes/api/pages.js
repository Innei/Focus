const { Router } = require('express')
const assert = require('http-assert')

const { Page } = require('../../models')

const router = Router()
/**
 * 获取首页渲染时 独立页面的标题. _id . order
 * @route GET /pages
 * @summary 获取首页渲染时 独立页面的标题. _id . order
 * @group 独立页面
 * @returns {object} 200 - eg. {ok,msg|data}
 */
router
  .get('/', async (req, res) => {
    const pages = await Page.find()
      .sort({ order: -1 })
      .select('-text -type -subtitle')

    if (pages.length) {
      return res.send({ ok: 1, data: pages })
    }
    res.send({
      ok: 0,
      msg: '主人还没有发布一篇介绍'
    })
  })
  .get('/:slug', async (req, res) => {
    const { slug } = req.params
    const query = await Page.findOne({
      slug
    })
    assert(query, 422, '不存在此记录')
    res.send({ ok: 1, data: query })
  })

module.exports = router
