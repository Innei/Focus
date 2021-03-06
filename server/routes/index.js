const { Router } = require('express')

module.exports = (app) => {
  const router = Router()

  router.use(require('../middlewares/clean'))
  router.use('/master', require('./api/master'))
  router.use('/posts', require('./api/posts'))
  router.use('/notes', require('./api/notes'))
  router.use('/categories', require('./api/categories'))
  router.use('/comments', require('./api/comments'))
  router.use('/pages', require('./api/pages'))
  router.use('/config', require('./api/config'))
  router.use('/admin', require('./api/admin'))
  if (process.env !== 'production') {
    router.use('/test', require('./api/test'))
  }
  router.use('/:resource', require('./api/rest'))

  app.use('/api', router)
  app.use('/', require('./xml'))
}
