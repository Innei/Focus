import E from '~/event/types'

const router = require('express').Router()
require('express-ws')(router)
module.exports = (app, ws) => {
  const wss = ws.getWss()

  app.ws('/gateway', function(ws, req) {
    ws.on('message', function(msg) {
      ws.send(msg)
    })
    req.app.on(E.MESSAGE_SEND, ({ type, message }) => {
      ws.send(
        JSON.stringify({
          type,
          message
        })
      )
    })
  })
}
