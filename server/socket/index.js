const consola = require('consola')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3001 })
wss.on('connection', (ws) => {
  consola.success({ message: 'WS connection', badge: true })
  ws.on('message', (message) => {
    consola.info('received: %s', message)
    ws.send(
      JSON.stringify({
        type: 'success',
        msg: 'hello'
      })
    )
  })
})
module.exports = wss
