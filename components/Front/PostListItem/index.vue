<template>
  <nuxt-link
    :to="`/posts/${i.categoryId ? i.categoryId.name : 'null'}/${i.slug}`"
    ondragstart="return false;"
  >
    <div class="post-item-left">
      <div class="date-day">
        {{ parseDate.day }}
      </div>
      <div class="date-month-year">
        {{ parseDate.month }} / {{ parseDate.year }}
      </div>
    </div>
    <div class="post-item-right">
      <h1 class="post-item-title">{{ i.title }}</h1>
      <div class="post-item-summary">{{ i.text }}</div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    i: {
      type: Object,
      required: true
    }
  },

  computed: {
    parseDate() {
      // const date = new Date(this.i.created)
      return {
        year: this.i.created.getFullYear(),
        month: this.i.created.getMonth() + 1,
        day: this.i.created.getDate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-item-summary {
  text-overflow: ellipsis;
}

a {
  padding: 2rem 0;
  display: block;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  display: flex;
  align-items: center;
  text-decoration: none;
}
.post-item-left,
.post-item-right {
  float: left;
}

.post-item-left {
  width: 20%;

  .date-year {
    text-align: center;
  }
}
</style>
