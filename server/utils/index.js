module.exports = {
  randomStr: () =>
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15),
  getClientIP(req) {
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
  }
}
