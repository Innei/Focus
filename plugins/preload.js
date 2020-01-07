/**
 * 加载页面前的的预加载配置和用户设置
 */
import rest from '~/api/rest'
const consola = require('consola')
export default ({ app, store, redirect, route, req }) => {
  app.$axios
    .get('/config')
    .then(({ data }) => {
      if (data.ok) {
        store.dispatch('config/init', data.config)
      }
    })
    .catch((e) => {
      if (route.path !== '/install') {
        consola.error(e.response.data.msg)
        redirect('/install')
      }
    })

  rest(app.$axios, 'getRecently', 'Page')().then((res) => {
    store.dispatch('pages/initPages', res)
  })

  const path = route.fullPath || req.originalUrl
  if (/\.html$/.test(path)) {
    app.router.replace(path.replace(/\.html$/, ''))
  }
}
