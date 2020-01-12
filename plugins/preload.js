/**
 * 加载页面前的的预加载配置和用户设置
 */
import rest from '~/api/rest'
import '~/assets/scss/markdown/shizuku.scss'

const consola = require('consola')
export default async ({ app, store, redirect, route, req }) => {
  try {
    const { data } = await app.$axios.get('/config')

    if (data.ok) {
      // console.log(data.menus)
      store.dispatch('config/init', [data.config, data.menus])
    }
  } catch (e) {
    if (route.path !== '/install') {
      consola.error(e.response.data.msg)
      redirect('/install')
    }
  }

  rest(app.$axios, 'getRecently', 'Page')().then((res) => {
    store.dispatch('pages/initPages', res)
  })

  const path = route.fullPath || req.originalUrl
  if (/\.html$/.test(path)) {
    app.router.replace(path.replace(/\.html$/, ''))
  }
}
