<template>
  <div v-if="data" class="note-wrap">
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
      <div>{{ $store.state.config.config.username }}</div>

      <i class="el-icon-edit"></i
      ><time
        >{{
          formatDate(
            data.created,
            viewport && !viewport.mobile
              ? 'YYYY[年]MMMD[日], h:mm:ss a'
              : 'YY/MM/D'
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

    <article id="markdown-render" ref="md" v-html="data.text"></article>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatDate, fromNow } from '~/utils'
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return { count: 0 }
  },

  mounted() {
    this.updateViewport()
    this.$nextTick(() => {
      // console.log(this.$refs.md)
      this.count = this.$refs.md.textContent.length
    })
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
  padding-top: 2rem;
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
