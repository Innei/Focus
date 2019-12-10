<template>
  <div id="header">
    <div @click="handleClickMenu" class="top menu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </div>
    <Nav class="navigation" :active="active" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Nav from './Nav'

export default {
  components: { Nav },
  methods: {
    handleClickMenu() {
      this.active = !this.active
    }
  },
  data() {
    return {
      // 这里直接拿是拿不到数据的. 只能用 watch
      active: (this.viewport && this.viewport.mobile) || false
    }
  },
  computed: {
    ...mapGetters(['viewport'])
  },
  watch: {
    viewport: {
      deep: true,
      handler(v) {
        // 及时响应变化
        if (v.mobile) {
          this.active = false
        } else {
          this.active = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#header {
  z-index: 3;
  width: (64 * 3) + px;
  top: 0;
  height: 100vh;
  position: fixed;
}
.navigation {
  opacity: 0.6;
  transition: opacity 0.6s;
  z-index: 2;

  &:hover {
    opacity: 1;
  }
}

.top {
  position: fixed;
  &.menu {
    padding: 12px;
    cursor: pointer;
    z-index: 3;
  }
}
</style>
