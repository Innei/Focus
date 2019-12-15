<template>
  <!-- <Basic>
    文章详情页 /:category/:slug
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
        <div class="post-meta-category" v-if="category">
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
      <div class="post-body" v-html="text" v-if="text"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MD from 'markdown-it'

// import rest from '~/api/rest'
import Post from '~/api/posts'
const md = new MD({
  html: true,
  xhtmlOut: true
})

export default {
  async asyncData({ app, route, error }) {
    const { category, slug } = route.params
    const data = await Post(app.$axios, 'getWithSlug')(category, slug)

    if (data.ok === 1 && data.path === `${category}/${slug}`) {
      return {
        text: md.render(data.text),
        title: data.title,
        category: data.categoryId ? data.categoryId : null,

        time: moment(data.modified).format('YYYY-MM-DD H:mm:ss')
      }
    } else {
      error({
        statusCode: 404,
        message: data.msg || '文章不存在'
      })
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
    padding: 3rem 24px;
  }
}
</style>
