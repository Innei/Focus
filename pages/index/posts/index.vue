<template>
  <!-- 文章列表页 -->
  <div class="page-list">
    <BigHead />
    <div id="post-list-wrap">
      <Item :i="i" v-for="i in data" :key="i._id" />
      <!-- <nuxt-link
        :to="`/posts/${i.categoryId ? i.categoryId.name : 'null'}/${i.slug}`"
        v-for="i in data"
        :key="i._id"
      >
        <div class="post-item-left">
          <div class="date-day">
            {{ i.created }}
          </div>
        </div>
        <div class="post-item-right">
          <h1 class="post-item-title">{{ i.title }}</h1>
          <div class="post-item-summary">{{ i.text }}</div>
        </div>
      </nuxt-link> -->
    </div>
  </div>
</template>

<script>
import rest from '~/api/rest'
import BigHead from '~/components/Front/BigHead/index'
import Item from '~/components/Front/PostListItem/index'
export default {
  async asyncData({ app, route, error }) {
    const data = await rest(
      app.$axios,
      'getRecently',
      'Post'
    )(route.query.page || 1, route.query.size || 10)
    if (data.ok) {
      data.data.map((item) => {
        item.created = new Date(item.created)
      })
      return {
        page: data.page,
        data: data.data
      }
    } else {
      error({
        message: data.msg,
        statusCode: 500
      })
    }
  },
  components: {
    BigHead,
    Item
  },
  data() {
    return {
      page: undefined,
      data: undefined
    }
  },
  methods: {
    parseDate(date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#post-list-wrap {
  padding: 3rem 10rem;
  max-width: 1024px;
  margin: auto;
}
</style>
