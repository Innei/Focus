const { Router } = require('express')

module.exports = (app) => {
  const router = Router()

  router.use('/user', require('./api/user'))
  router.use('/posts', require('./api/posts'))

  app.use('/api', router)
}
