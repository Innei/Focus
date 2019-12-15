<template>
  <div class="page-nav" v-if="page && page.totalPage > 1">
    <div class="page-wrap">
      <div
        class="prev btn"
        :class="{ hide: page.currentPage === 1 }"
        @click="$emit('to', page.currentPage - 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M14.71 15.88L10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"
          />
        </svg>
      </div>
      <div class="page">
        <span
          v-for="n in pages"
          :key="n"
          class="page-num"
          :class="{ active: n === page.currentPage }"
          @click="$emit('to', n)"
          >{{ n }}</span
        >
      </div>
      <div
        class="next btn"
        :class="{ hide: page.currentPage + 1 > page.totalPage }"
        @click="$emit('to', page.currentPage + 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.29 15.88L13.17 12 9.29 8.12c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3c-.39.39-1.02.39-1.41 0-.38-.39-.39-1.03 0-1.42z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      default() {
        return null
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.pageNav()
    })
  },
  data() {
    return {
      pages: []
    }
  },
  methods: {
    pageNav() {
      // 页数大于5的处理
      // 先清空数组
      this.pages.splice(0)
      if (this.page && this.page.totalPage > 5) {
        this.pages.push(...[1, 2, 3, '...', this.page.totalPage])
      } else {
        for (let i = 1; i <= this.page.totalPage; i++) {
          this.pages.push(i)
        }
      }
    }
  },
  watch: {
    page: {
      deep: true,
      handler() {
        this.pageNav()
        // 回到 0 0 加载动画
        window.scrollTo(0, 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .page-num.active {
    color: map-get($map: $material, $key: 'light');
  }
  .page-num,
  .btn {
    transition: color 0.5s;
    margin-right: 30px;
    cursor: pointer;
    color: map-get($map: $material, $key: 'main');
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
  .btn {
    display: flex;
    align-items: center;
  }
  .page-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
