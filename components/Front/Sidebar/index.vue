<template>
  <div id="header">
    <transition name="fade">
      <OverLay
        v-show="navActive && viewport.mobile"
        @click.native="handleClickMenu"
      />
    </transition>
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
    <Nav class="navigation" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Nav from './Nav'
import OverLay from './components/overlay'

export default {
  components: { Nav, OverLay },

  methods: {
    handleClickMenu() {
      this.setStatus(!this.navActive)
    },
    ...mapActions('Navigation', ['setStatus'])
  },
  computed: {
    ...mapGetters(['viewport', 'navActive'])
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
    padding: 12px;
    cursor: pointer;
    z-index: 3;
  }
}

@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .top.menu {
    opacity: 0.2;
    transition: opacity 0.5s;
    &:active {
      opacity: 1;
    }
  }
}
</style>
