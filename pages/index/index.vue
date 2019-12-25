<template>
  <main><Nav></Nav></main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Nav from '~/components/Front/Home/Nav'
export default {
  methods: {
    ...mapActions('Navigation', ['setStatus']),
    ...mapActions('viewport', ['updateViewport'])
  },
  components: {
    Nav
  },
  mounted() {
    this.updateViewport()
    if (!this.viewport.mobile) {
      this.setStatus(true)
    }
  },
  computed: {
    ...mapGetters(['viewport'])
  }
}
</script>

<style lang="scss" scoped>
main {
  padding-top: 1.5rem;
}
</style>
