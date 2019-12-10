<template>
  <div id="app">
    <Header />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions({
      updateViewport: 'viewport/updateViewport'
    })
  }
}
</script>
