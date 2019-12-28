class Timer {
  constructor({ fn, name, time }) {
    this.fn = fn
    this.name = name
    this.time = time
    this.timer = null
  }

  create() {
    this.timer = setInterval(this.fn, this.time)
  }
  clear() {
    this.timer = clearInterval(this.timer)
  }

  resetTimer() {
    this.clear()
    this.create()
  }
}

class TimerList {
  constructor() {
    this.timers = []
    this.names = new Set()
  }

  add(name, fn, time) {
    if (this.names.has(name)) {
      throw new Error('name is already exist.')
    }
    if (typeof name !== 'string') {
      throw new TypeError('name must be a string.')
    }
    const timer = new Timer({ fn, name, time })
    this.timers.push(timer)
    timer.create()
    this.names.add(name)
  }

  del(name) {
    const find = this.timers.findIndex((item) => item.name === name)
    if (find !== -1) {
      this.timers[find].clear()
      this.timers.splice(find, 1)
      this.names.delete(name)
      return true
    }
    return false
  }

  reset(name) {
    this.timers.find((item) => {
      if (item.name === name) {
        item.reset()
        return true
      }
    })
  }

  delAll() {
    this.timers.map((item) => {
      item.clear()
    })
    this.timers.length = 0
    this.names.length = 0
  }
}
module.exports = TimerList
// const timerList = new TimerList()
// timerList.add(
//   'test',
//   () => {
//     console.log(new Date())
//   },
//   3000
// )
// timerList.add(
//   'test2',
//   () => {
//     console.warn(new Date())
//   },
//   3000
// )

// setTimeout(() => {
//   timerList.del('test')
// }, 5000)
