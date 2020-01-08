const consola = require('consola')
const WebSocket = require('ws')
const Observable = require('../events')
class WebSocketConnection extends Observable {
  constructor() {
    super()
    this.wss = new WebSocket.Server({ port: 3001 })
    this._createConnection()
  }

  _createConnection() {
    this.wss.on('connection', (ws) => {
      consola.success({ message: '[ws] connected', badge: true })

      ws.on('message', (message) => {
        ws.send(
          JSON.stringify({
            type: 'success',
            msg: 'hello'
          })
        )
      })

      this._bindEvents(ws)
    })
  }

  _bindEvents(ws) {
    this.on('message', (payload) => {
      ws.send(JSON.stringify(payload))
    })
  }

  get clients() {
    return this.wss.clients
  }
}

const wsc = new WebSocketConnection()

module.exports = wsc
