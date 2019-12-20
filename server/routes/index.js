const { Router } = require('express')

module.exports = (app) => {
  const router = Router()

  router.use('/user', require('./api/user'))
  router.use('/posts', require('./api/posts'))
  router.use('/notes', require('./api/notes'))
  router.use('/categories', require('./api/categories'))
  router.use('/comments', require('./api/comments'))
  router.use('/:resource', require('./api/rest'))

  app.use('/api', router)
}
