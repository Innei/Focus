<template>
  <Basic>
    <Loading v-show="!data" />
    <div class="note-wrap" v-if="data">
      <h1 class="title">{{ data.title }}</h1>
      <div
        :title="
          `创建于 ${formatDate(
            data.created,
            'YYYY-MM-DD H:mm:ss'
          )}, 修改于 ${formatDate(
            data.modified,
            'YYYY-MM-DD H:mm:ss'
          )}, 全文字数: ${count}, 阅读次数: ${data.count.read}, 喜欢次数: ${
            data.count.like
          }`
        "
        class="note-meta"
      >
        <i class="el-icon-s-custom"></i>
        <div>用户</div>

        <i class="el-icon-edit"></i
        ><time
          >{{
            formatDate(
              data.created,
              !viewport.mobile
                ? 'YYYY[年]MMMD[日], h:mm:ss a'
                : 'YY[年]MMMD[日]'
            )
          }}
        </time>

        <i class="el-icon-s-flag"></i>
        <time>{{ fromNow(data.modified) }} </time>
        <i class="el-icon-collection"></i>
        <div>{{ data.count.read }}</div>

        <svg
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
          ></path>
        </svg>
        <div>{{ data.count.like }}</div>
      </div>

      <article id="markdown-render" v-html="data.text" ref="md"></article>
    </div>
  </Basic>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters, mapActions } from 'vuex'
import Mdit from 'markdown-it'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Notes from '~/api/notes'
import { formatDate, fromNow } from '~/utils'

import '~/assets/scss/markdown/shizuku.scss'

const md = new Mdit({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  components: {
    Basic,
    Loading
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
  beforeMount() {
    this.updateViewport()
  },
  mounted() {
    setTimeout(() => {
      this.count = this.$refs.md.textContent.length
    })
  },
  data() {
    return { data: undefined, count: 0 }
  },
  methods: {
    ...mapActions('Navigation', ['setStatus']),
    ...mapActions('viewport', ['updateViewport']),
    formatDate,
    fromNow
  },
  computed: {
    ...mapGetters(['navActive', 'viewport'])
  }
}
</script>

<style lang="scss" scoped>
.note-wrap {
  .title {
    text-align: center;
  }
  .note-meta {
    margin: 1rem;
    text-align: center;
    line-height: 16px;
    font-size: 16px;
    > div,
    > time {
      display: inline-block;
    }
    // align-items: center;

    // justify-content: center;
    // display: flex;
  }
}
</style>
<style lang="scss">
.note-wrap article {
  p:first-child::first-letter {
    float: left;
    font-size: 3em;
    margin: 0 0.2em 0 0;
  }
  p {
    clear: both;
  }
  p:not(:first-child)::first-letter {
    margin-left: 2rem;
  }
}
</style>
