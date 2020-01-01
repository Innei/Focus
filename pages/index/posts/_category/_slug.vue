<template>
  <!-- <Basic>
    文章详情页 /posts/:category/:slug
  </Basic> -->
  <div id="post">
    <div class="post-head-wrapper">
      <div class="post-title">
        {{ title }}
      </div>
      <div
        :title="
          `创建于 ${ctime}, 修改于 ${mtime}, ${
            category ? `分类于${category.name}` : ''
          }\n全文字数: ${count}`
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
          <nuxt-link :to="`/categories/${category.slug}`">{{
            category.name
          }}</nuxt-link>
        </div>
      </div>
    </div>
    <div class="post-body-wrapper wrap">
      <article
        id="markdown-render"
        ref="md"
        v-html="text"
        v-if="text"
        class="post-body"
      ></article>
      <div class="post-tortree" v-if="!isMobile">
        <Tree :tree="tree" :class="{ hide: navActive }" class="tree" />
      </div>
      <Comment :pid="pid" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import MD from 'markdown-it'
import prism from 'markdown-it-prism'
import { sleep, isMobile } from '~/utils'

import Post from '~/api/posts'
import Tree from '~/components/Front/TorTree'
import Comment from '~/components/Front/Comment'

import '~/assets/scss/markdown/shizuku.scss'

const md = new MD({
  html: true,
  xhtmlOut: true
}).use(prism)

export default {
  components: {
    Tree,
    Comment
  },
  data() {
    return {
      tree: [],
      isMobile: false
    }
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
        category: data.categoryId ?? null,
        ctime: moment(data.created).format('M/D/YY H:mm:ss'),
        mtime: moment(data.modified).format('M/D/YY H:mm:ss'),
        count: 0,
        pid: data._id
      }
    } else {
      error({
        statusCode: 404,
        message: data.msg || '文章不存在'
      })
    }
  },
  async mounted() {
    this.isMobile = isMobile()
    setTimeout(() => {
      // 加载代码行数 别问我为什么不用 prism 自带的插件, 因为不支持 ssr
      this.parseLineNumber()
      this.count = this.countText(this.$refs.md)
      this.setStatus(false)
    }, 50)

    if (document.documentElement.scrollTop === 0) {
      this.tree = this.parseTree()
    } else {
      window.scrollTo(0, 0)

      // console.time()
      while (document.documentElement.scrollTop > 50) {
        await sleep(500)
        // console.timeLog()
      }
      // console.timeEnd()
      this.tree = this.parseTree()
      // setTimeout(() => {
      //   // 等待回到顶点
      //   this.tree = this.parseTree()
      // }, 2000)
    }
  },
  methods: {
    ...mapActions('Navigation', ['setStatus']),

    parseLineNumber() {
      try {
        const NEW_LINE_EXP = /\n(?!$)/g
        const code = this.$refs.md.querySelectorAll('pre > code')
        for (const dom of code) {
          dom.innerHTML = dom.innerHTML
            .split(NEW_LINE_EXP)
            .map((i, j) => `<span class="line-number">${j + 1}</span>${i}`)
            .join('\n')
        }
      } catch (e) {}
    },

    countText(dom) {
      return dom.textContent.length
    },
    parseTree() {
      const titles = [
        ...this.$refs.md.querySelectorAll(
          '#markdown-render h1,#markdown-render h2,#markdown-render h3,#markdown-render h4,#markdown-render h5,#markdown-render h6'
        )
      ]
      const tree = []
      titles.map((title, index) => {
        title.setAttribute('id', title.textContent)

        tree.push({
          name: title.textContent,
          y: parseInt(title.getBoundingClientRect().y),
          nexty: titles[index + 1]
            ? parseInt(titles[index + 1].getBoundingClientRect().y)
            : document.documentElement.scrollHeight,
          level: title.tagName.slice(1)
        })
      })

      return tree
    }
  },
  computed: {
    ...mapGetters(['navActive'])
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
    color: var(--text);
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

.post-tortree {
  width: 0;
  height: 0;
  top: 0;
  right: -4px;
  position: absolute;
  display: flex;
  align-items: center;
  animation: fade-in 3s;
}

@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .post-body-wrapper {
    padding: 3rem 36px;
  }
}
@media (max-width: map-get($map: $viewports, $key: 'hpad')) {
  .post-body-wrapper {
    padding: 3rem 36px !important;
  }
}

.tree {
  transition: opacity 0.5s, visibility 0.5s;
}
</style>
