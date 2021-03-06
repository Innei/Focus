<template>
  <div>
    <nuxt-link
      v-if="viewport && viewport.mobile"
      :to="`/posts/${i.categoryId ? i.categoryId.name : 'null'}/${i.slug}`"
      class="mobile-post-item"
    >
      <div class="item">
        <div class="title">{{ i.title }}</div>
        <div class="date">{{ parseDate.month }} / {{ parseDate.day }}</div>
      </div>
    </nuxt-link>

    <nuxt-link
      v-else
      :to="`/posts/${i.categoryId ? i.categoryId.name : 'null'}/${i.slug}`"
      ondragstart="return false;"
      class="post-item"
    >
      <div v-if="viewport && !viewport.mobile" class="post-item-left">
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
            i.summary ||
              (i.text.length > 150 ? i.text.substr(0, 150) + ' ...' : i.text)
          }}
        </div>
        <div class="post-item-meta">
          <span v-if="viewport && viewport.mobile">
            <i class="el-icon-alarm-clock"></i>
            {{
              `${parseDate.year}-${String(parseDate.month).padStart(
                2,
                0
              )}-${String(parseDate.day).padStart(2, 0)}`
            }}
          </span>
          <span v-if="i.categoryId">
            <i class="el-icon-folder"></i>
            <nuxt-link :to="`/categories/${i.categoryId.slug}`">{{
              i.categoryId.name
            }}</nuxt-link>
          </span>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    i: {
      type: Object,
      required: true
    },
    viewport: {
      type: Object,
      default() {
        return {}
      }
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

a.post-item {
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
    color: var(--text);
    transition: color 0.5s;
  }
  .post-item-summary {
    margin-top: 8px;
    color: var(--shallow);
    font-size: 18px;
  }
}

a:hover {
  color: unset !important;
  .post-item-right {
    .post-item-title {
      color: map-get($map: $material, $key: 'light');
    }
  }
}

@media (max-width: map-get($viewports, 'mobile')) {
  .post-item-left,
  .post-item-right {
    float: none;
    width: unset;
  }

  .post-item-left {
    display: flex;

    font-size: 0.8em;
    .date-day {
      margin-right: 1ch;
    }
  }
}

.post-item-meta {
  opacity: 0.8;
  font-size: 0.8rem;
  padding-top: 0.8rem;

  > * {
    margin-right: 1em;
  }
}
.mobile-post-item {
  width: 100%;
  padding: 0.6rem 0;

  .item {
    overflow: hidden;
    .title {
      float: left;
      width: 80%;
      text-overflow: ellipsis;
    }
    .date {
      float: left;
      color: var(--gray);
      font-family: Consolas, monaco, monospace;
    }

    &::after {
      content: '';
      clear: both;
    }
  }
}
</style>
