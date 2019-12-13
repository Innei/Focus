<template>
  <!-- <Basic>
    文章列表
  </Basic> -->
  <div id="post">
    <div class="post-head-wrapper">
      <div class="post-title">
        {{ title }}
      </div>
      <div class="post-meta">
        <time datetime="2019-05-16T09:20:28.000Z" itemprop="datePublished">
          {{ time }} </time
        >&nbsp;
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"
          />
        </svg>
        <a href="/tags/网易云音乐/">{{ category }}</a>
      </div>
    </div>
    <div class="post-body-wrapper">
      <div class="post-body" v-html="text" v-if="text"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MD from 'markdown-it'

import rest from '~/api/rest'

const md = new MD({
  html: true,
  xhtmlOut: true
})

export default {
  async asyncData({ app }) {
    const { data } = await rest(
      app.$axios,
      'getOne',
      'Post'
    )('5df322aba3968d17e5763354')

    return {
      text: md.render(data.text),
      title: data.title,
      category: data.categoryId ? data.categoryId.name : null,
      time: moment(data.modified).format('YYYY-MM-DD H:mm:ss')
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
#post {
  width: 100%;
}
.post-head-wrapper {
  margin-top: -20px;
  background: no-repeat center;
  background-size: cover;
  position: relative;
  padding-top: 140px;

  .post-title {
    color: map-get($map: $colors, $key: 'title');
    padding: 80px 35px 30px 35px;
    font-size: 30px;
    font-weight: 600;
    font-style: normal;
    line-height: 1.5em;
    text-align: center;
  }
  .post-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
}
.post-body-wrapper {
  padding: 3rem 10rem;
  max-width: 1024px;
  margin: auto;
}
@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .post-body-wrapper {
    padding: 3rem 24px;
  }
}
</style>
