<template>
  <!-- 文章列表页 -->
  <div class="page-list">
    <BigHead />
    <div id="post-list-wrap">
      <Item :i="i" v-for="i in data" :key="i._id" />
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
