<template>
  <Home class="center" color="#fff">
    <news-swiper :news="data" />
    <!-- <div class="me">
      <div class="avatar">
        <img :src="config.avatar" :alt="config.username" />
      </div>
      <h1 class="title">
        {{ config.title }}
      </h1>
      <div class="desc">
        {{ config.desc }}
      </div>
      <div class="links"></div>
    </div>

    <News title="最新博文" to="/posts">
      <template #icon>
        <Code />
      </template>
      <template v-if="news.posts.data">
        <NewsItems :list="news.posts.data" type="Post" />
      </template>
    </News>
    <News title="最新随记" to="/notes">
      <template #icon>
        <Lines />
      </template>
      <template v-if="news.notes.data">
        <NewsItems :list="news.notes.data" type="Note" />
      </template>
    </News> -->
    <!-- <News title="最新博文" to="/posts"> </News> -->
  </Home>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Rest from '~/api/rest'
import Home from '~/layouts/Home'
import News from '~/components/News'
import NewsItems from '~/components/NewsItems'
import NewsSwiper from '~/components/Home/NewsSwiper'
import { Lines, Code } from '~/components/Icons'

import '~/assets/scss/grid.scss'

export default {
  components: {
    Home,
    News,
    Lines,
    Code,
    NewsItems,
    NewsSwiper
  },
  async created() {
    const outdate =
      new Date() - this.news?.posts?.updateAt > 3600000 ||
      new Date() - this.news?.notes?.updateAt > 3600000 ||
      true

    if (outdate || !this.news.posts.updateAt || !this.news.notes.updateAt) {
      const posts = await Rest(
        this.$axios,
        'getRecently',
        'Post'
      )({ size: 6, select: '-text' })
      const notes = await Rest(
        this.$axios,
        'getRecently',
        'Note'
      )({ size: 6, select: '-text' })

      await this.updateNews({ data: posts.data, type: 'Post' })
      await this.updateNews({ data: notes.data, type: 'Note' })
    }
  },
  methods: {
    ...mapActions('news', ['updateNews'])
  },
  computed: {
    ...mapGetters(['config', 'news']),
    data() {
      return this.news.posts && this.news.notes
        ? Object.values(this.news)
            .map((item) => [...item.data])
            .flat(1)
            .sort((a, b) => a.created > b.created)
            .slice(0, 5)
        : []
    }
  }
}
</script>

<style lang="scss" scoped>
.me {
  width: 100%;
  text-align: center;
  margin-bottom: 5rem;

  .avatar img {
    height: 150px;
    width: 150px;
    object-fit: cover;
    border-radius: 50%;
  }
}
.center {
  margin: 0 10rem;
}

@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .center {
    margin: 0 3rem;
  }
}
</style>
