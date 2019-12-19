<template>
  <article id="category">
    <div class="wrap">
      <h1>{{ '分类: ' + data.name }}</h1>
      <ul v-for="year in years" :key="year.year" class="year-post">
        <h3>{{ year.year }} 年</h3>
        <div class="year">
          <li v-for="child in year.children" :key="child._id" class="post-item">
            <span class="post-created">{{
              `${child.time.month} 月 ${child.time.day} 日`
            }}</span>
            <nuxt-link :to="`/posts/${$route.params.slug}/${child.slug}`"
              ><span class="post-title">{{ child.title }}</span></nuxt-link
            >
          </li>
        </div>
      </ul>
    </div>
  </article>
</template>

<script>
import rest from '~/api/rest'
import { parseDate } from '~/utils'
export default {
  async asyncData({ app, error, params }) {
    const data = await rest(app.$axios, 'getOne', 'Category')(params.slug)
    if (data.ok) {
      return { data: data.data }
    }
  },
  methods: {
    filterDate(dateArr) {
      const set = new Set()
      for (const i of dateArr) {
        i.time = parseDate(i.created)
        if (!set.has(i.time.year)) {
          set.add(i.time.year)
        }
      }
      const years = []

      for (const i of set.values()) {
        const index = years.push({ year: i, children: [] }) - 1
        for (const j of dateArr) {
          if (j.time.year === i) {
            years[index].children.push(j)
          }
        }
      }

      return years
    }
  },
  mounted() {
    this.years = this.filterDate(this.data.children)
  },
  data() {
    return {
      years: []
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  max-width: 50rem;
  margin-top: 6rem;
  > * {
    margin-bottom: 1em;
  }
  font-family: $Heiti;
}

@media (max-width: map-get($map: $viewports, $key: 'pad')) {
  #category {
    display: flex;
  }
}
h1,
h3 {
  position: relative;

  font-weight: 200;
  margin-bottom: 1em;
  line-height: 1.5;
}
h3 {
  font-weight: 400 !important;
  color: #546e7a;
}
h1::before {
  content: '';
  padding-left: 0.75em;
  border-left: 2px solid map-get($map: $material, $key: 'shallow');
}
h3:before {
  content: '&';
  margin-right: 0.5rem;
  color: currentColor;
  font-weight: 400;
}
ul,
.year {
  padding: 1em;
}
.post-item {
  margin-bottom: 0.5em;
  display: flex;

  .post-created {
    width: 8rem;
  }
}
</style>
