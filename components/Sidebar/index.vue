<template>
  <div id="header">
    <transition name="fade">
      <OverLay
        v-show="navActive && viewport.mobile"
        @click.native="handleClickMenu"
      />
    </transition>
    <transition name="fade">
      <div v-show="Over" class="top-title-desc">
        {{ config.title }}
      </div>
    </transition>
    <div
      :style="Over ? 'opacity: 1' : ''"
      class="top menu"
      @click="handleClickMenu"
    >
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
    <Nav class="navigation" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Nav from './Nav'
import OverLay from './components/overlay'

import { isMobile, debounce } from '~/utils'

export default {
  components: { Nav, OverLay },
  data() {
    return {
      isMobile: null,
      Over: false,
      scrollHandler: debounce(() => {
        const Over =
          document.documentElement.scrollTop > window.innerHeight / 4 ||
          document.documentElement.scrollTop > screen.height / 4
        this.Over = Over
      })
    }
  },
  mounted() {
    this.isMobile = isMobile()
    if (this.isMobile) {
      document.addEventListener('scroll', this.scrollHandler, 5)
    }
  },
  methods: {
    handleClickMenu() {
      this.setStatus(!this.navActive)
    },
    ...mapActions('Navigation', ['setStatus'])
  },
  computed: {
    ...mapGetters(['viewport', 'navActive', 'config'])
  },
  watch: {
    viewport: {
      deep: true,
      handler(v) {
        // 及时响应变化
        if (v.mobile || v.hpad) {
          this.setStatus(false)
        }
      }
    }
  },
  beforeDestroy() {
    if (this.isMobile) {
      document.removeEventListener('scroll', this.scrollHandler)
    }
  }
}
</script>

<style lang="scss" scoped>
#header {
  z-index: 3;
  width: 0;
  top: 0;
  height: 0;
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
    padding: 0.75rem;
    cursor: pointer;
    z-index: 3;
  }
}

@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .top.menu {
    top: 0.7rem;
    left: 0.7rem;
    opacity: 0.2;
    transition: opacity 0.5s;
    &:active {
      opacity: 1;
    }
  }
}

.top-title-desc {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: (0.7+ 0.75rem) 6rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: var(--white);
  font-weight: 300;
  box-shadow: 0 0 10px -4px #232323;
}
</style>
