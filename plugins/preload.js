/**
 * 加载页面前的的预加载配置和用户设置
 */
export default async ({ app, store }) => {
  const { data } = await app.$axios.get('/config')
  if (data.ok) store.dispatch('config/init', data.config)
  else {
    throw new Error('获取配置失败')
  }
}
