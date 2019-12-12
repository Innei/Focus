const { Router } = require('express')
const assert = require('http-assert')

const isMater = require('../../middlewares/isMaster')
const Category = require('../../models/Category')

const router = Router()

router
  .get('/', async (req, res) => {
    const r = await Category.find()
    res.send(r)
  })
  .post('/', async (req, res) => {})
module.exports = router
