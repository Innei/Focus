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
      <div class="post-item-summary">
        {{
          i.desc || i.text.length > 150
            ? i.text.substr(0, 150) + ' ...'
            : i.text
        }}
      </div>
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

  .date-month-year {
    text-align: center;
    color: map-get($map: $material, $key: 'shallow');
  }
  .date-day {
    text-align: center;
    font-size: 24px;
  }
}
.post-item-right {
  width: 80%;
  .post-item-title {
    font-size: 28px;
    margin-top: 0px;
    color: map-get($map: $colors, $key: 'text');
    transition: color 0.5s;
  }
  .post-item-summary {
    margin-top: 8px;
    color: map-get($map: $colors, $key: 'shallow');
    font-size: 18px;
  }
}

a:hover {
  .post-item-right {
    .post-item-title {
      color: map-get($map: $material, $key: 'light');
    }
  }
}
</style>
