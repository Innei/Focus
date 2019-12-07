const { Router } = require('express')

module.exports = (app) => {
  const router = Router()

  router.use('/user', require('./api/user'))

  app.use('/api', router)
}
