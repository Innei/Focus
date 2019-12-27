/**
 * 加载页面前的的预加载配置和用户设置
 */
const consola = require('consola')
export default ({ app, store, redirect, route }) => {
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
}
