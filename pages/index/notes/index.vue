<template>
  <Basic>
    <Loading v-show="!data" />
    <Note :data="data" v-if="data" />
  </Basic>
</template>

<script>
import { Message } from 'element-ui'
import { mapActions } from 'vuex'
import Mdit from 'markdown-it'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Notes from '~/api/notes'
import Note from '~/components/Front/Note'

import '~/assets/scss/markdown/shizuku.scss'

const md = new Mdit({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  components: {
    Basic,
    Loading,
    Note
  },

  data() {
    return { data: undefined }
  },
  async created() {
    const data = await Notes(this.$axios, 'getLastest')()
    if (data.ok) {
      this.data = data.data
      this.data.text = md.render(this.data.text)

      this.setStatus(false)
      history.pushState(
        null,
        this.data.title,
        `${location.origin}/notes/${this.data.nid}`
      )
    } else {
      Message.error({ message: data.msg })
    }
  },
  methods: {
    ...mapActions('Navigation', ['setStatus'])
  }
}
</script>
