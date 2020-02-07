import E from '~/event/types'

const router = require('express').Router()
require('express-ws')(router)
module.exports = (app, ws) => {
  const wss = ws.getWss()

  app.ws('/gateway', async function(ws, req) {
    if (!req.cookies.focus_admin_token) {
      return ws.close()
    }

    const token = JSON.parse(req.cookies.focus_admin_token).token
    if (!(await require('~/plugins/wsAuth')(token))) {
      return ws.close()
    }

    ws.on('message', toEvent)
    // .on('auth', async (token) => {
    //   console.log(req.cookies)
    // })
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

function toEvent(message) {
  try {
    let { type, payload } = JSON.parse(message)
    this.emit(type, payload || message)
  } catch (ignore) {
    this.emit(undefined, message)
  }
}
