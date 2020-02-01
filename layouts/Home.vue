<template>
  <main>
    <Nav :links="pages"></Nav>
    <div class="containers">
      <nuxt />
      <slot />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Nav from '~/components/Home/Nav'

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
.containers {
  margin-top: 5rem;
}
</style>
