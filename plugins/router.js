export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    window.scrollTo({
      leftL: 0,
      top: 0,
      behavior: 'smooth'
    })
    next()
  })
}
