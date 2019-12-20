<template>
  <Basic>
    随记列表
    <Loading v-show="false" />
  </Basic>
</template>

<script>
import { Message } from 'element-ui'
import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Notes from '~/api/notes'
export default {
  components: {
    Basic,
    Loading
  },
  async asyncData({ app }) {
    const data = await Notes(app.$axios, 'getLastest')()
    if (data.ok) {
      return { data: data.data }
    }
    Message.error({ message: data.msg })
  },
  mounted() {
    if (this.data) {
      history.pushState(
        null,
        this.data.title,
        `${location.origin}/notes/${this.data.nid}`
      )
    }
  }
}
</script>

<style></style>
