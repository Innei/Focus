<template>
  <!-- <div
    id="nav"
    :class="viewport && viewport.mobile ? '' : 'active'"
    ref="menu"
    v-if="viewport"
  >
     -->
  <div id="nav" :class="{ active: active }">
    <Nav-item text="我" icon="user" link="/">
      <template #svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="32"
          height="32"
          viewBox="0 0 128 128"
          style=" fill:#000000;"
        >
          <path
            fill="#fff"
            d="M87 59.7c0 12.7-10.3 23-23 23s-23-10.3-23-23V32.3l46 5.5V59.7zM101.1 115.6C93.7 102.7 79.9 94 64 94h0c-15.9 0-29.7 8.7-37.1 21.6L27 119h74L101.1 115.6z"
          ></path>
          <path
            fill="#444b54"
            d="M26.9 118.6c-.5 0-1-.1-1.5-.4-1.4-.8-1.9-2.6-1.1-4.1C32.4 99.9 47.6 91 64 91s31.6 8.9 39.7 23.1c.8 1.4.3 3.3-1.1 4.1s-3.3.3-4.1-1.1C91.4 104.7 78.2 97 64 97c-14.2 0-27.4 7.7-34.5 20.1C29 118 28 118.6 26.9 118.6zM77.6 29.1l-.4-.6c-2.9-4.1-7.7-6.6-12.7-6.6H56c-12.7 0-23 10.3-23 23v0c0 1.7 1.3 3 3 3h5.2c.1 0 .1 0 .2 0 11.5 0 23.2 0 31.6-7.5v.1c.4-.4.8-.7 1.1-1.1 1.1-1.2 3-1.4 4.2-.3 1.3 1.1 1.4 3.1.2 4.4-.5.5-.9.9-1.4 1.4-1.3 1.3-.8 3.5.9 4.2l0 0c1 .4 2.1.6 3.2.7 1.5.2 2.7 1.4 2.7 3v6.8c0 10.6-8 19.7-18.6 20.4C53.8 80.8 44.1 71.6 44 60.1c0-1.6-1.2-3-2.8-3.1-1.7-.1-3.2 1.3-3.2 3 0 14.3 11.7 26 26 26 13.9 0 25.3-10.9 26-24.7 0-.1 0-.2 0-.3V47v-3-1C90 35.8 84.6 29.9 77.6 29.1z"
          ></path>
        </svg>
      </template>
    </Nav-item>

    <Nav-item text="生活随记" icon="notes" link="/notes">
      <template #svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M20 11H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1zM4 18h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM20 6H4c-.55 0-1 .45-1 1v.01c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1z"
          />
        </svg>
      </template>
    </Nav-item>

    <Nav-item text="代码人生" icon="code" link="/posts">
      <template #svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.4zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.01 0-1.4.39-.39 1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0-.39-.39-.39-1.01 0-1.4z"
          />
        </svg>
      </template>
    </Nav-item>

    <Nav-item icon="moment" text="碎碎杂谈" link="/moments">
      <template #svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M19.65 9.04l-4.84-.42-1.89-4.45c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.73 3.67-3.18c.67-.58.32-1.68-.56-1.75zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
          />
        </svg>
      </template>
    </Nav-item>

    <Nav-item icon="timeline" text="时光历程" link="/timeline">
      <template #svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <defs><path id="a" d="M0 0h24v24H0z" /></defs>
          <clipPath><use xlink:href="#a" overflow="visible" /></clipPath>
          <defs><path id="b" d="M0 0h24v24H0z" /></defs>
          <clipPath><use xlink:href="#b" overflow="visible" /></clipPath>
          <path
            d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2zm0 0c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"
          />
        </svg>
      </template>
    </Nav-item>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NavItem from './components/Nav-item'
export default {
  components: {
    NavItem
  },
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters(['navActive'])
  },
  mounted() {
    // Why nav -> index -> vuex action
    // this.$nextTick(() => {
    //   // console.log(this.viewport)
    //   if (this.viewport.mobile) {
    //     this.$refs.menu.classList.remove('active')
    //   }
    // })
  },
  methods: {
    ...mapActions('Navigation', ['setStatus'])
  },
  watch: {
    active(val) {
      this.setStatus(val)
    }
  }
}
</script>

<style lang="scss" scoped>
#nav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  padding-left: 24px;
  position: relative;
  height: 100vh;
  width: (64 * 3) + px;
  user-select: none;
  background: rgba($color: #fff, $alpha: 0.7);
  backdrop-filter: blur(5px);
  transform: translateX(-192px);
  opacity: 0;
  transition: transform 0.8s, opacity 1s;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    width: 1px;
    background-image: linear-gradient(
      #fff 50%,
      map-get($map: $colors, $key: 'gray') 150%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }
}
.icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  // box-sizing: border-box;
  // border: 1.48px solid #434d54;
  box-shadow: 0 0 0px 1.4px map-get($map: $colors, $key: 'gray');

  svg {
    fill: map-get($map: $colors, $key: 'gray');
  }
}

#nav.active {
  transform: translateX(0);
  opacity: 1;
  @for $i from 0 through 6 {
    a:nth-child(#{$i}) {
      animation: jump 0.28s * $i both 0.2s ease-out;
    }
  }
  &::after {
    opacity: 0.4;
  }
}

@keyframes jump {
  0% {
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    transition-timing-function: ease-out;
    opacity: 1;
  }
  50% {
    transform: translateX(33px);
    transition-timing-function: ease-in-out;
  }
}
// width 192px
</style>
