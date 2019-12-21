<template>
  <Basic>
    <Loading v-show="!data" />
    <Note :data="data" v-if="data" />
    <Btn
      class="right"
      v-if="next"
      @click.native="$router.push(`/notes/${next.nid}`)"
    >
      <i class="el-icon-arrow-right"></i>
    </Btn>
    <Btn class="right item" v-if="next"><i class="el-icon-more"></i></Btn>
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
import Btn from '~/components/Front/Note/components/btn'

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
    Note,
    Btn
  },

  data() {
    return { data: undefined, next: undefined }
  },
  async created() {
    const data = await Notes(this.$axios, 'getLastest')()
    if (data.ok) {
      this.data = data.data
      this.data.text = md.render(this.data.text)
      this.next = data.next
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

<style lang="scss" scoped>
.right {
  right: 2rem;
  bottom: 2rem;

  &.item {
    bottom: 6rem;
  }
}
</style>
