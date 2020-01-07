<template>
  <Home class="is-post wrap">
    <header>
      <h1>{{ title }}</h1>
      <h3 v-if="subtitle">{{ subtitle }}</h3>
    </header>
    <article>
      <div class="text" v-html="text"></div>
    </article>
  </Home>
</template>

<script>
import MD from 'markdown-it'
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
  mounted() {
    this.text = md.render(this.text)
  }
}
</script>
