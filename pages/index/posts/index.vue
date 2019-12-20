<template>
  <!-- 文章列表页 -->

  <div class="page-list">
    <BigHead />

    <div id="post-list-wrap" :class="{ loading: loading }">
      <Item :i="i" v-for="i in data" :key="i._id" :viewport="viewport" />
    </div>

    <Navigation :page="page" @to="handleTo" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import rest from '~/api/rest'
import BigHead from '~/components/Front/BigHead/index'
import Item from '~/components/Front/PostListItem/index'
import Navigation from '~/components/Front/Navigation'

export default {
  components: {
    BigHead,
    Item,
    Navigation
  },
  data() {
    return {
      page: undefined,
      data: undefined,
      loading: false
    }
  },
  watch: {
    $route: {
      deep: true,
      async handler(val) {
        console.log(val.query.page, this.page.currentPage)

        if (parseInt(val.query.page) !== this.page.currentPage) {
          await this.updateData(val.query.page)
        }
      }
    }
  },
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
  methods: {
    ...mapActions('viewport', ['updateViewport']),
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
        this.loading = true
        this.$nuxt.$loading.start()
        const data = await rest(this.$axios, 'getRecently', 'Post')(page)
        if (data.ok) {
          data.data.map((item) => {
            item.created = new Date(item.created)
          })
          this.data = data.data
          this.page = data.page
          this.loading = false
          this.$nuxt.$loading.finish()
          return true
        }
      }
      this.$nuxt.$loading.fail()
      return false
    }
  },
  computed: {
    ...mapGetters(['viewport'])
  },
  mounted() {
    this.updateViewport()
  }
}
</script>

<style lang="scss" scoped>
#post-list-wrap {
  padding: 3rem 10rem;
  max-width: 1024px;
  margin: auto;
  position: relative;

  a {
    transition: opacity 0.5s;
  }
  &.loading a {
    opacity: 0.3;
    user-select: none;
    pointer-events: none;
  }
}

.page-list {
  min-height: calc(100vh - 6rem);
}

// responsive design
@media (max-width: map-get($viewports, 'mobile')) {
  #post-list-wrap {
    padding: 3rem 36px;
  }

  html {
    font-size: 0.8rem;
  }

  a.post-item {
    display: block;
  }
}
</style>
