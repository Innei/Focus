import E from '~/event/types'

const router = require('express').Router()
require('express-ws')(router)
module.exports = (app, ws) => {
  const wss = ws.getWss()

  app.ws('/gateway', async function(ws, req) {
    // console.log('connect')
    // console.log(req.app)

    if (!req.cookies.focus_admin_token) {
      // console.log('cookie close')

      return ws.close()
    }

    const token = JSON.parse(req.cookies.focus_admin_token).token
    if (!(await require('~/plugins/wsAuth')(token))) {
      // console.log('token => close')

      return ws.close()
    }

    ws.on('message', toEvent)

    req.app.on(E.MESSAGE_SEND, ({ type, message }) => {
      ws.send(
        JSON.stringify({
          type,
          message
        })
      )
    })

    ws.on('close', function() {
      console.log('disconnected')
      req.app.removeAllListeners(E.MESSAGE_SEND)
    })
  })
}

function toEvent(message) {
  try {
    const { type, payload } = JSON.parse(message)
    this.emit(type, payload || message)
  } catch (ignore) {
    this.emit(undefined, message)
  }
}
