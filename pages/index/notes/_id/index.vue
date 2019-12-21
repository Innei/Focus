<template>
  <Basic>
    <Loading v-show="!data" />
    <Note :data="data" v-if="data" />
    <Btn class="right">
      <i class="el-icon-arrow-right"></i>
    </Btn>
    <Btn class="right item"><i class="el-icon-more"></i></Btn>
    <Btn class="left"><i class="el-icon-arrow-left"></i></Btn>
  </Basic>
</template>

<script>
import { Message } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'
import Mdit from 'markdown-it'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Rest from '~/api/rest'
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
    return { data: undefined }
  },
  async asyncData({ app, params }) {
    const data = await Rest(app.$axios, 'getOne', 'Note')(params.id)
    if (data.ok) {
      data.data.text = md.render(data.data.text)
      return { data: data.data }
    } else {
      Message.error({ message: data.msg })
    }
  },
  mounted() {
    if (this.data) {
      this.setStatus(false)
    }
  },
  methods: {
    ...mapActions('Navigation', ['setStatus'])
  },
  computed: {
    ...mapGetters(['navActive'])
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
.left {
  left: 2rem;
  bottom: 2rem;
}
</style>
