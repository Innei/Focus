const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

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

// bind routes
require('./routes/index')(app)

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
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
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
  } else next()
})
