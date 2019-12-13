<template>
  <div id="post-list-wrap">
    <nuxt-link to="/study/test22" v-for="i in data" :key="i._id">
      <h1 class="post-item-title">{{ i.title }}</h1>
      <div class="post-item-summary">{{ i.text }}</div>
      <div class="post-item-meta">
        {{ i.created }}
      </div>
    </nuxt-link>
    <!-- <div class="" v-for="i in data">{{ i._id }}</div> -->
  </div>
</template>

<script>
import rest from '~/api/rest'

export default {
  async asyncData({ app, route, error }) {
    const data = await rest(
      app.$axios,
      'getRecently',
      'Post'
    )(route.query.page || 1, route.query.size || 10)
    if (data.ok) {
      return {
        page: data.page,
        data: data.data
      }
    } else {
      error({
        message: '出现异常',
        statusCode: 500
      })
    }
  },

  data() {
    return {
      page: undefined,
      data: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
#post-list-wrap {
  .post-item-summary {
    text-overflow: ellipsis;
  }
}
</style>
