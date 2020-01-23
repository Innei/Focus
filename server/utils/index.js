const assert = require('http-assert')
const md5 = (text) =>
  require('crypto')
    .createHash('md5')
    .update(text)
    .digest('hex')

module.exports = {
  randomStr: () =>
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15),
  getClientIP: (req) => {
    let ip =
      req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      ''
    if (ip.split(',').length > 0) {
      ip = ip.split(',')[0]
    }
    return ip
  },
  md5,
  checkPassword: (pwd) => {
    assert(typeof pwd === 'string', 400, '我觉得你是在欠打，没事不要测接口')
    let strength = 0

    if (pwd.length > 6) {
      strength++
    }
    if (/[0-9]/.test(pwd)) {
      strength++
    }
    if (/[a-z]/.test(pwd)) {
      strength++
    }
    if (/[A-Z]/.test(pwd)) {
      strength++
    }
    if (/[\s|!-\.|;-\?]/.test(pwd)) {
      strength++
    }
    return strength
  },
  getAvatar(mail) {
    return `https://www.gravatar.com/avatar/${md5(mail)}`
  }
}
