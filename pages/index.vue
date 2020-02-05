<template>
  <!-- 前台入口文件 -->
  <div id="app">
    <Sidebar />
    <div id="views" :class="{ 'no-padding': !navActive }">
      <nuxt-child />
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cookie from 'js-cookie'
import Sidebar from '~/components/Sidebar'
import Footer from '~/components/Footer'
import { User } from '~/api'
import { debounce, throttle } from '~/utils'

export default {
  components: {
    Sidebar,
    Footer
  },
  async mounted() {
    const fetch = await User(this.$axios, 'checkLogged')()
    if (fetch.ok) {
      this.setLogged({
        status: Boolean(fetch.logged),
        token: localStorage.token || cookie.get('token') || null
      })
    }
    this.updateViewport()
    window.addEventListener('resize', debounce(this.updateViewport, 50))

    // scroll direction
    window.addEventListener(
      'scroll',
      throttle(() => {
        const currentY = document.documentElement.scrollTop
        const direction = this.currentY >= currentY ? 'up' : 'down'
        this.currentY = currentY
        this.updateScroll(direction)
      }, 13)
    )
  },
  computed: {
    ...mapGetters(['navActive', 'viewport'])
  },
  methods: {
    ...mapActions({
      updateViewport: 'viewport/updateViewport',
      setStatus: 'Navigation/setStatus',
      setLogged: 'master/setLogged',
      updateScroll: 'app/updateScroll'
    })
  },
  data() {
    return { currentY: 0 }
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: relative;
}
#views {
  padding-left: 192px;
  transition: padding 0.8s;
  min-height: 90vh;
}
#views.no-padding {
  padding: 0;
}
@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  #views {
    padding-left: 0;
  }
}
</style>
