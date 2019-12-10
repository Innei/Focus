<template>
  <div id="app">
    <Header />
    <div id="views" :class="{ 'no-padding': !navActive }">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Header from '~/components/Front/Header'
import utils from '~/utils/index'

export default {
  components: {
    Header
  },
  mounted() {
    this.updateViewport()
    window.addEventListener('resize', utils.debounce(this.updateViewport, 50))
  },
  computed: {
    ...mapGetters(['navActive'])
  },
  methods: {
    ...mapActions({
      updateViewport: 'viewport/updateViewport'
    })
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
