const { Router } = require('express')
const User = require('../../models/User')
const router = Router()

router
  .get('/', async (req, res) => {
    res.send({
      data: {
        username: 'y'
      },
      ok: 1
    })
  })
  .post('/', async (req, res) => {
    const { username, password, email, url } = req.body
    const doc = await User.create({ username, password, email, url })
    res.send(doc)
  })

module.exports = router
