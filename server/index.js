require('dotenv').config()
const express = require('express')
const consola = require('consola')

const { Nuxt, Builder } = require('nuxt')

const app = express()

if (process.env.NODE_ENV !== 'production') {
  // api docs
  require('./docs')(app)
}
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'
config.no_web = process.env.VUE_ENV === 'no-web'
// connect to db and init db
require('./db')
// first time to install
require('./plugins/checkInit')

// global middleware
app.use(express.json())
app.use(require('cors')())
app.use(require('express-useragent').express())
app.use(require('cookie-parser')())
// bind api routes
require('./routes/index')(app)
// bind admin static page
app.use(
  '/admin',
  express.static(require('path').join(__dirname, '/../static/admin'))
)
app.use('/admin/*', (req, res) => {
  res.redirect('/admin')
})

async function start() {
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
}
start()

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
