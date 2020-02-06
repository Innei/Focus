const Router = require('@koa/router')

module.exports = (app) => {
  const router = new Router({
    prefix: '/api'
  })
  router.use(require('./api/config'))
  // router.use(require('../middlewares/clean'))
  // router.use('/master', require('./api/master'))
  // router.use('/posts', require('./api/posts'))
  // router.use('/notes', require('./api/notes'))
  // router.use('/categories', require('./api/categories'))
  // router.use('/comments', require('./api/comments'))
  // router.use('/pages', require('./api/pages'))
  // router.use('/config', require('./api/config'))
  // router.use('/admin', require('./api/admin'))
  // router.use('/:resource', require('./api/rest'))
  // app.use('/api', router)
  app.use(require('./xml'))
  app.use(router.routes())
}
