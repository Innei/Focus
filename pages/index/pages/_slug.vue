<template>
  <Home class="is-post wrap">
    <header>
      <h1>{{ title }}</h1>
      <h3 v-if="subtitle">{{ subtitle }}</h3>
    </header>
    <article>
      <div class="text" v-html="md"></div>
    </article>
  </Home>
</template>

<script>
import MD from 'markdown-it'
import { mapGetters } from 'vuex'
import Home from '~/layouts/Home'
import rest from '~/api/rest'

const md = new MD({
  html: true,
  linkify: true,
  typographer: true
})
export default {
  components: {
    Home
  },
  async asyncData({ app, params }) {
    try {
      const fetch = await rest(app.$axios, 'getOne', 'Page')(params.slug)
      return {
        ...fetch.data
      }
    } catch (e) {}
  },
  data() {
    return { md: '' }
  },
  mounted() {
    this.md = md.render(this.text)
  },
  head() {
    return {
      title: this.title + ' - ' + this.config.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.text?.replace(/\s/gi, '').slice(0, 100)
        },
        {
          hid: 'site_name',
          name: 'og:site_name',
          content: this.config.title
        },
        {
          hid: 'title',
          name: 'og:title',
          content: this.title
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['config'])
  }
}
</script>

<style lang="scss" scoped>
header {
  h3 {
    color: var(--gray);
    opacity: 0.8;
  }
}
</style>
