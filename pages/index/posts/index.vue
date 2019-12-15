<template>
  <!-- 文章列表页 -->

  <div class="page-list">
    <BigHead />

    <div id="post-list-wrap" :class="{ loading: loading }">
      <Item :i="i" v-for="i in data" :key="i._id" />
      <transition name="fade">
        <div id="loading" v-if="loading">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            style="margin:auto;display:block;"
            width="101.3px"
            height="101.3px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              r="39"
              stroke="#fe718d"
              stroke-width="6"
              fill="none"
            ></circle>
            <path
              d="M 17 50 Q 33.5 36.2947 50 50 Q 66.5 63.7053 83 50 A 33 33 0 0 1 17 50"
              fill="#46dff0"
            >
              <animate
                attributeName="d"
                repeatCount="indefinite"
                dur="1.6393442622950818s"
                calcMode="spline"
                keyTimes="0;0.5;1"
                values="M17 50 Q33.5 35 50 50 Q66.5 65 83 50 A33 33 0 0 1 17 50;M17 50 Q33.5 65 50 50 Q66.5 35 83 50 A33 33 0 0 1 17 50;M17 50 Q33.5 35 50 50 Q66.5 65 83 50 A33 33 0 0 1 17 50"
                keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
              ></animate>
            </path>
          </svg>
        </div>
      </transition>
    </div>

    <Navigation :page="page" @to="handleTo" />
  </div>

  <!-- TODO loading  this.loading -->
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
      data: undefined,
      loading: false
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
        this.loading = true

        const data = await rest(this.$axios, 'getRecently', 'Post')(page)
        if (data.ok) {
          data.data.map((item) => {
            item.created = new Date(item.created)
          })
          this.data = data.data
          this.page = data.page
          this.loading = false
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
  position: relative;

  a {
    transition: opacity 0.5s;
  }
  &.loading a {
    opacity: 0.3;
  }
}

.page-list {
  min-height: calc(100vh - 6rem);
}

#loading {
  display: flex;
  align-items: center;
  justify-content: center;
  // position: absolute;
  // top: 0;
  // left: 0;
  // bottom: 0;
  // right: 0;
  position: fixed;
  left: 50%;
  top: calc(100vh - 200px);
  transform: translate(-50%, -50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// responsive design
@media (max-width: map-get($viewports, 'mobile')) {
  #post-list-wrap {
    padding: 3rem 36px;
  }

  html {
    font-size: 0.8rem;
  }
}
</style>
