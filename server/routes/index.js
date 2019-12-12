const { Router } = require('express')

module.exports = (app) => {
  const router = Router()

  router.use('/user', require('./api/user'))
  router.use('/posts', require('./api/posts'))
  router.use('/categories', require('./api/categories'))
  router.use('/:resource', require('./api/rest'))

  app.use('/api', router)
}
