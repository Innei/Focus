require('dotenv').config()
const consola = require('consola')
const morgan = require('morgan')
const expressWs = require('express-ws')
const { Nuxt, Builder } = require('nuxt')
const express = require('express')
async function start() {
  const app = new express()
  // bind event
  require('./event')(app)

  if (process.env.NODE_ENV !== 'production') {
    // api docs
    require('./docs')(app)
  }
  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')
  config.dev = process.env.NODE_ENV !== 'production'
  config.no_web = process.env.VUE_ENV === 'no-web'
  // connect to db and init db
  await require('./db')
  // first time to install
  require('./plugins/checkInit')

  // global middleware
  app.use(express.json())
  app.use(require('cors')())
  app.use(require('express-useragent').express())
  app.use(require('cookie-parser')())
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('short'))
  }
  // bind api routes
  require('./routes/index')(app)
  // bind admin static page
  app.use(
    '/admin',
    express.static(require('path').join(__dirname, '/../static/admin'), {
      maxAge: '1d',
      setHeaders(res, path, stat) {
        res.set('X-timestamp', Date.now())
      }
    })
  )
  app.use('/admin/*', (req, res) => {
    res.redirect('/admin')
  })
  // connect ws
  const ws = expressWs(app)
  require('./socket/')(app, ws)
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev && !config.no_web) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  if (config.dev) {
    // no cache in dev mode
    app.use(nuxt.render)
  } else {
    // cache route in prod mode
    // set cache
    const apicache = require('apicache')
    const redis = require('redis')
    const cacheWithRedis = apicache.options({
      redisClient: redis.createClient()
    }).middleware
    app.use(cacheWithRedis(process.env.CACHE), nuxt.render)
  }

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${
      process.env.NODE_ENV !== 'production' ? 'localhost' : host
    }:${port}${config.no_web ? '/api-docs' : ''}`,
    badge: true
  })

  // global error handler
  app.use((err, req, res, next) => {
    if (err) {
      res
        .status(err.status || err.statusCode || 500)
        .send({ msg: err.message, ok: 0 })

      if (process.env.NODE_ENV !== 'production') {
        consola.error({
          message: err,
          badge: true
        })
      }
    } else next()
  })
}
start()
