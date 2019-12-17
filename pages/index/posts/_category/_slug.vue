<template>
  <!-- <Basic>
    文章详情页 /:category/:slug
  </Basic> -->
  <div id="post">
    <div class="post-head-wrapper">
      <div class="post-title">
        {{ title }}
      </div>
      <div
        :title="
          `创建于 ${ctime}, 修改于 ${mtime}, 分类于 ${category.name}\n全文字数: ${count}`
        "
        class="post-meta"
      >
        创建于&nbsp;<time>{{ ctime }} </time>&nbsp;
        <div v-if="category" class="post-meta-category" style="display: flex;">
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
          <nuxt-link :to="`/category/${category.slug}`">{{
            category.name
          }}</nuxt-link>
        </div>
      </div>
    </div>
    <div class="post-body-wrapper">
      <div
        id="markdown-render"
        ref="md"
        v-html="text"
        v-if="text"
        class="post-body"
      ></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MD from 'markdown-it'
import prism from 'markdown-it-prism'

import '~/assets/scss/markdown/shizuku.scss'
// import 'prismjs/themes/prism.css'
// import rest from '~/api/rest'
import Post from '~/api/posts'
const md = new MD({
  html: true,
  xhtmlOut: true
}).use(prism)

export default {
  data() {
    return {}
  },
  async asyncData({ app, route, error, redirect }) {
    let { slug } = route.params
    const { category } = route.params
    if (/.html$/.test(slug)) {
      slug = slug.replace(/.html$/, '')
      redirect(encodeURI(`/posts/${category}/${slug}`))
    }
    const data = await Post(app.$axios, 'getWithSlug')(category, slug)

    if (data.ok === 1 && data.path === `${category}/${slug}`) {
      const text = md.render(data.text)

      return {
        text,
        title: data.title,
        category: data.categoryId ? data.categoryId : null,
        ctime: moment(data.created).format('M/D/YY H:mm:ss'),
        mtime: moment(data.modified).format('M/D/YY H:mm:ss'),
        count: 0
      }
    } else {
      error({
        statusCode: 404,
        message: data.msg || '文章不存在'
      })
    }
  },
  mounted() {
    setTimeout(() => {
      // 加载代码行数 别问我为什么不用 prism 自带的插件, 那 sb 不支持 ssr
      this.parseLineNumber()
      this.count = this.countText(this.$refs.md)
    }, 50)
  },
  methods: {
    parseLineNumber() {
      const NEW_LINE_EXP = /\n(?!$)/g
      const code = this.$refs.md.querySelectorAll('pre > code')
      for (const dom of code) {
        dom.innerHTML = dom.innerHTML
          .split(NEW_LINE_EXP)
          .map((i, j) => `<span class="line-number">${j + 1}</span>${i}`)
          .join('\n')
      }
    },
    countText(dom) {
      return dom.textContent.length
    }
  }
}
</script>

<style lang="scss" scoped>
#post {
  width: 100%;
  min-height: calc(100vh - 6rem);
}
.post-head-wrapper {
  margin-top: -20px;
  background: no-repeat center;
  background-size: cover;
  position: relative;
  padding-top: 140px;

  .post-title {
    color: map-get($map: $colors, $key: 'text');
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
    opacity: 0.8;
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
    padding: 3rem 36px;
  }
}
@media (max-width: map-get($map: $viewports, $key: 'laptop')) {
  .post-body-wrapper {
    padding: 3rem 36px;
  }
}
</style>
