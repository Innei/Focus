<template>
  <!-- 文章列表页 -->
  <div class="page-list">
    <BigHead :name="config.title" :desc="config.desc" />
    <client-only>
      <div id="post-list-wrap" :class="{ loading: loading }">
        <div v-if="viewport && viewport.mobile" class="top-post-year">
          {{ getTopPostYear }}
        </div>
        <Item v-for="i in data" :key="i._id" :i="i" :viewport="viewport" />
      </div>

      <Navigation v-if="page" :page="page" @to="handleTo" />
    </client-only>
    <backtop />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import rest from '~/api/rest'
import BigHead from '~/components/BigHead'
import Item from '~/components/PostListItem'
import Navigation from '~/components/Navigation'
import Backtop from '~/components/Backtop'

export default {
  components: {
    BigHead,
    Item,
    Navigation,
    Backtop
  },
  data() {
    return {
      page: null,
      data: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['viewport', 'config']),
    getTopPostYear() {
      return new Date(this.data?.[0].created).getFullYear()
    }
  },
  watch: {
    $route: {
      deep: true,
      async handler(val) {
        if (parseInt(val.query.page) !== this.page.currentPage) {
          await this.updateData(val.query.page)
        }
      }
    }
  },
  async created() {
    const data = await rest(
      this.$axios,
      'getRecently',
      'Post'
    )({ page: this.$route.query.page || 1, size: this.$route.query.size || 10 })
    if (data.ok) {
      data.data.map((item) => {
        item.created = new Date(item.created)
      })

      this.page = data.page
      this.data = data.data
    }
  },
  mounted() {
    this.updateViewport()
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
        const data = await rest(this.$axios, 'getRecently', 'Post')({ page })
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
  }
}
</script>

<style lang="scss" scoped>
#post-list-wrap {
  padding: 3rem 10rem;
  max-width: 1024px;
  min-height: 31.25rem;
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
.top-post-year {
  padding-bottom: 0.6rem;
  font-weight: 800;
  font-family: Consolas, monaco, monospace;
  font-size: 1.4rem;
}
</style>
