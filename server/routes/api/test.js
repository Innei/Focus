const { Router } = require('express')
import E from '~/event/types'
const router = new Router()
router.get('/ws', (req, res) => {
  req.app.emit(E.MESSAGE_SEND, {
    type: 'info',
    message: 'test'
  })
  res.status(204).send()
})
module.exports = router
