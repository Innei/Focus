<template>
  <!-- 前台入口文件 -->
  <div id="app">
    <Header />
    <div id="views" :class="{ 'no-padding': !navActive }" @click="handleToggle">
      <nuxt-child />
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Header from '~/components/Front/Header'
import Footer from '~/components/Front/Footer'
import { debounce } from '~/utils/index'

import 'element-ui/lib/theme-chalk/icon.css'

export default {
  components: {
    Header,
    Footer
  },
  mounted() {
    this.updateViewport()
    window.addEventListener('resize', debounce(this.updateViewport, 50))
  },
  computed: {
    ...mapGetters(['navActive', 'viewport'])
  },
  methods: {
    ...mapActions({
      updateViewport: 'viewport/updateViewport',
      setStatus: 'Navigation/setStatus'
    }),
    // ...mapActions('Navigation', ['setStatus']),
    handleToggle() {
      if (this.viewport.moblie) {
        this.setStatus(false)
      }
    }
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
