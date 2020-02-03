<template>
  <div class="news-items">
    <li v-for="item in list" :key="item._id">
      <nuxt-link
        :to="
          type === 'Note'
            ? `/notes/${item.nid}`
            : item.categoryId
            ? `/${type.toLowerCase()}s/${item.categoryId.slug}/${item.slug}`
            : `/${type.toLowerCase()}s/null/${item.slug}`
        "
        >{{ item.title }}</nuxt-link
      >
      <span class="date">{{ renderDate(item.created) }}</span>
    </li>
  </div>
</template>

<script>
import { parseDate, padString } from '~/utils'
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator(val) {
        return ['Post', 'Note'].includes(val)
      }
    }
  },
  methods: {
    renderDate(date) {
      const { day, month } = parseDate(new Date(date))
      return `${padString(month, 2, 0)}/${padString(day, 2, 0)}`
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2;
}
</style>
