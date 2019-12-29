<template>
  <main><Nav :links="links"></Nav></main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import Nav from '~/components/Front/Home/Nav'
import rest from '~/api/rest'

export default {
  async asyncData({ app }) {
    try {
      const fetch = await rest(app.$axios, 'getRecently', 'Page')()

      if (fetch.ok) {
        const links = fetch.data.map((item) => {
          return {
            to: `/pages/${item.slug}`,
            name: item.title
          }
        })
        links.unshift({
          to: '/',
          name: '首页'
        })
        return { links }
      } else {
        // app.$message.error(fetch.msg)
        return {
          links: [
            {
              to: '/',
              name: '首页'
            }
          ]
        }
      }
    } catch (e) {
      // app.$message.error(e.response.data.msg)
    }
  },
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
  padding-top: 2rem;
}
</style>
