<template>
  <main>
    <Nav :links="pages"></Nav>
    <nuxt />
    <slot />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Nav from '~/components/Front/Home/Nav'

export default {
  components: {
    Nav
  },
  computed: {
    ...mapGetters(['pages'])
  }
}
</script>

<style lang="scss" scoped>
main {
  padding-top: 2rem;
}
</style>
