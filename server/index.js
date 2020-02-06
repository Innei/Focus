require('dotenv').config()
import Koa from 'koa'
import express from 'express'
const consola = require('consola')
const morgan = require('koa-morgan')
const { Nuxt, Builder } = require('nuxt')

async function start() {
  const app = new Koa({ proxy: true })

  // error handling
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        consola.error({
          message: err,
          badge: true
        })
      }
      ctx.status = err.status || 500
      ctx.body = { msg: err.message, ok: 0 }
      ctx.app.emit('error', err, ctx)
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    // api docs
    const docSever = express()
    require('./docs')(docSever)
    docSever.listen(3001)
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
  app.use(require('@koa/cors')())
  // app.use(require('express-useragent').express())

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('short'))
  }
  // bind api routes
  require('./routes/index')(app)
  // bind admin static page
  const Router = require('@koa/router')
  const router = new Router({
    prefix: '/admin'
  })
  router.use(
    require('koa-static')(
      require('path').resolve(__dirname, '/../static/admin')
    )
  )
  app.use(router.routes())

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
    app.use((ctx) => {
      ctx.status = 200
      ctx.respond = false // Mark request as handled for Koa
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    })
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
