/**
 * 通用接口
 */

const { Router } = require('express')
const assert = require('http-assert')

// const { Option } = require('../../models/index')

const router = Router({
  mergeParams: true
})

router
  .use(require('../../middlewares/resource')())
  .get('/', async (req, res) => {
    const { page = 1, size = 10 } = req.query
    assert(size < 20, 400, '要素过多')
    assert(page > 0, 400, '页数不正确')
    const queryOptions = {}
    const condition = {}
    // console.log(req.Model.modelName)

    if (req.Model.modelName === 'Comment') {
      if (req.query.state) {
        condition.state = parseInt(req.query.state)
        condition.hasParent = false
        // TODO 处理两级以上的子评论
        queryOptions.populate = {
          path: 'children',
          populate: {
            path: 'children'
          }
        }
      }
    }
    if (req.Model.modelName === 'Post') {
      queryOptions.populate = 'categoryId'
    }
    const data = await req.Model.find(condition)
      .setOptions(queryOptions)
      .skip((page - 1) * size)
      .limit(Number(size))
      .sort({ created: -1 })

    if (data.length === 0 && page !== 1) {
      return res.send({ ok: 0, msg: '没有下页啦!' })
    }
    const total = await req.Model.countDocuments(condition)
    const totalPage = Math.ceil(total / size)
    const pageOptions = {
      size: data.length,
      currentPage: Number(page),
      totalPage,
      total,
      hasNextPage: totalPage > page,
      hasPrevPage: Number(page) !== 1
    }

    res.send({
      ok: 1,
      page: pageOptions,
      data
    })
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 400, '不正确的请求')
    const r = await req.Model.findById(id).populate('categoryId')
    if (r) {
      res.send({ ok: 1, data: r })
    } else {
      res.send({ ok: 0, msg: '不存在此记录' })
    }
  })
  .delete('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, 400, '记录不存在')

    const r = await req.Model.deleteOne({ _id: id })
    // 删除条目后 Option.count 自减吗？
    // if (r.deletedCount) {
    //   await Option.updateOne(
    //     {
    //       name: 'count'
    //     },
    //     {
    //       $inc: {
    //         ['value.' +
    //         require('inflection')
    //           .classify(req.params.resource)
    //           .toLowerCase() +
    //         'Count']: -1
    //       }
    //     }
    //   )
    // }
    res.send({ ...r, msg: r.deletedCount ? '删除成功' : '删除失败' })
  })
module.exports = router
