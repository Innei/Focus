<template>
  <!-- 文章列表页 -->
  <div class="page-list">
    <BigHead />
    <div id="post-list-wrap">
      <Item :i="i" v-for="i in data" :key="i._id" />
    </div>
    <Navigation :page="page" @to="handleTo" />
    <!-- TODO 分页器 FOOTER COPYRIGHT -->
  </div>
</template>

<script>
import rest from '~/api/rest'
import BigHead from '~/components/Front/BigHead/index'
import Item from '~/components/Front/PostListItem/index'
import Navigation from '~/components/Front/Navigation'
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
    Item,
    Navigation
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
    },
    async handleTo(page) {
      if (await this.updateData(page)) {
        this.$router.push(`/posts?page=${page}`)
      }
    },
    async updateData(page) {
      if (!isNaN(page) && page !== this.page.currentPage) {
        const data = await rest(this.$axios, 'getRecently', 'Post')(page)
        if (data.ok) {
          data.data.map((item) => {
            item.created = new Date(item.created)
          })
          this.data = data.data
          this.page = data.page
          return true
        }
      }
      return false
    }
  },
  watch: {
    $route: {
      deep: true,
      async handler(val) {
        await this.updateData(val.query.page)
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
