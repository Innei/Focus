const Express = require('express')
const EventEmitter = require('events')
module.exports = class extends Express {
  constructor() {
    super()
    this._event = new EventEmitter()
  }

  on(event, listener) {
    this._event.on(event, listener)
  }

  off(event, listener) {
    this._event.off(event, listener)
  }

  once(event, listener) {
    this._event.once(event, listener)
  }

  emit(event, ...args) {
    this._event.emit(event, ...args)
  }
}
