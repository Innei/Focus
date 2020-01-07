const axios = require('axios')
const consola = require('consola')
const inflection = require('inflection')

class SyncToGist {
  constructor(token, gistId) {
    this.token = token
    this.gistId = gistId
    this.$axios = axios.create({
      baseURL: 'https://api.github.com/gists/',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
        Authorization: `token ${this.token}`
      }
    })
  }

  static $axios = axios.create({
    baseURL: 'https://api.github.com/gists/'
  })

  static async getGist(gistId) {
    try {
      const { data } = await SyncToGist.$axios.get(gistId)

      return data
    } catch (err) {
      consola.error(err.response.data)
    }
  }

  async patchGist(payload, type) {
    try {
      const toJson = JSON.stringify(payload, null, 2)
      const origin = {
        description: `Focus's ${type} sync to gist.`,
        public: true,
        files: {
          [`${inflection.classify(type)}.focus.json`]: {
            content: `{"lastUpload": "${Date.now()}"}`
          },
          Post: {
            content: toJson
          }
        }
      }
      const { data } = await this.$axios.patch(this.gistId, origin)
      return {
        ok: 1,
        msg: '同步成功',
        data
      }
    } catch (err) {
      // console.log(err)
      return {
        ok: 0,
        msg: '上传失败了  ' + err.response.statusText,
        code: err.response.status || err.response.statusCode
      }
    }
  }
}

module.exports = SyncToGist
