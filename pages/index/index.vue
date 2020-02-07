<template>
  <Home class="center" color="#fff">
    <news-swiper :news="data" />
    <section>
      <nuxt-link :to="'/notes'" class="section-link">
        <h3 class="flex">
          {{ typeName.get('note') }}
          <i class="el-icon-arrow-right" />
        </h3>
      </nuxt-link>
      <Row :gutter="45">
        <el-col
          v-for="note in news.notes && news.notes.data"
          :key="note._id"
          :xs="24"
          :sm="12"
          :md="8"
          :xl="6"
        >
          <Card :item="note" type="note" />
        </el-col>
      </Row>
    </section>
    <section>
      <nuxt-link :to="'/notes'" class="section-link">
        <h3 class="flex">
          {{ typeName.get('post') }}
          <i class="el-icon-arrow-right" />
        </h3>
      </nuxt-link>
      <Row :gutter="45">
        <el-col
          v-for="post in news.posts && news.posts.data"
          :key="post._id"
          :xs="24"
          :sm="12"
          :md="8"
          :xl="6"
        >
          <Card :item="post" type="post" />
        </el-col>
      </Row>
    </section>

    <section>
      <nuxt-link :to="'/notes'" class="section-link">
        <h3 class="flex">
          更多精彩
        </h3>
      </nuxt-link>
    </section>
  </Home>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Col, Row } from 'element-ui'

import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/row.css'

import Rest from '~/api/rest'
import Home from '~/layouts/Home'
import News from '~/components/News'
import NewsItems from '~/components/NewsItems'
import NewsSwiper from '~/components/Home/NewsSwiper'
import Card from '~/components/Home/PostItemCard'
import { Lines, Code } from '~/components/Icons'

export default {
  components: {
    Home,
    News,
    Lines,
    Code,
    NewsItems,
    NewsSwiper,
    Card,
    ElCol: Col,
    Row
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
    ...mapGetters(['config', 'news', 'menus']),
    data() {
      return this.news.posts && this.news.notes
        ? Object.values(this.news)
            .map((item) => [...item.data])
            .flat(1)
            .sort((a, b) => a.created > b.created)
            .slice(0, 5)
        : []
    },
    typeName() {
      const type = ['Post', 'Note']
      const map = new Map()
      this.menus.map((item, i) => {
        if (type.includes(item.type)) {
          map.set(item.type.toLowerCase(), item.title)
        }
      })
      return map
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
.section-link {
  margin: 1rem 0;
  font-size: 1.3rem;
  font-family: $Heiti;
}
section a {
  color: #666;
}
h3 {
  align-items: center;
  i {
    font-size: 0.8rem;
    margin-left: 8px;
  }
}
</style>
