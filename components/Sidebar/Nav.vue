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
          style="fill: var(--gray)"
        >
          <path
            style=" fill: var(--white)"
            d="M87 59.7c0 12.7-10.3 23-23 23s-23-10.3-23-23V32.3l46 5.5V59.7zM101.1 115.6C93.7 102.7 79.9 94 64 94h0c-15.9 0-29.7 8.7-37.1 21.6L27 119h74L101.1 115.6z"
          ></path>
          <path
            style="fill: var(--gray)"
            d="M26.9 118.6c-.5 0-1-.1-1.5-.4-1.4-.8-1.9-2.6-1.1-4.1C32.4 99.9 47.6 91 64 91s31.6 8.9 39.7 23.1c.8 1.4.3 3.3-1.1 4.1s-3.3.3-4.1-1.1C91.4 104.7 78.2 97 64 97c-14.2 0-27.4 7.7-34.5 20.1C29 118 28 118.6 26.9 118.6zM77.6 29.1l-.4-.6c-2.9-4.1-7.7-6.6-12.7-6.6H56c-12.7 0-23 10.3-23 23v0c0 1.7 1.3 3 3 3h5.2c.1 0 .1 0 .2 0 11.5 0 23.2 0 31.6-7.5v.1c.4-.4.8-.7 1.1-1.1 1.1-1.2 3-1.4 4.2-.3 1.3 1.1 1.4 3.1.2 4.4-.5.5-.9.9-1.4 1.4-1.3 1.3-.8 3.5.9 4.2l0 0c1 .4 2.1.6 3.2.7 1.5.2 2.7 1.4 2.7 3v6.8c0 10.6-8 19.7-18.6 20.4C53.8 80.8 44.1 71.6 44 60.1c0-1.6-1.2-3-2.8-3.1-1.7-.1-3.2 1.3-3.2 3 0 14.3 11.7 26 26 26 13.9 0 25.3-10.9 26-24.7 0-.1 0-.2 0-.3V47v-3-1C90 35.8 84.6 29.9 77.6 29.1z"
          ></path>
        </svg>
      </template>
    </Nav-item>

    <Nav-item
      :text="Note.title ? Note.title : '生活随记'"
      icon="notes"
      link="/notes"
    >
      <template #svg>
        <Lines />
      </template>
    </Nav-item>

    <Nav-item
      :text="Post.title ? Post.title : '代码人生'"
      icon="code"
      link="/posts"
    >
      <template #svg>
        <Code />
      </template>
    </Nav-item>

    <Nav-item
      icon="moment"
      :text="Moment.title ? Moment.title : '碎碎杂谈'"
      link="/moments"
    >
      <template #svg>
        <HalfStar />
      </template>
    </Nav-item>

    <Nav-item
      icon="timeline"
      :text="Timeline.title ? Timeline.title : '时光历程'"
      link="/timeline"
    >
      <template #svg>
        <TimeLine />
      </template>
    </Nav-item>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NavItem from './components/Nav-item'
import { Code, HalfStar, Lines, TimeLine } from '~/components/Icons'
export default {
  components: {
    NavItem,
    Code,
    HalfStar,
    Lines,
    TimeLine
  },
  data() {
    return {
      active: false,
      Post: {},
      Note: {},
      Timeline: {},
      Home: {},
      Moment: {}
    }
  },
  mounted() {
    this.menus.forEach((item) => {
      this[item.type] = Object.assign({}, item)
    })
  },
  computed: {
    ...mapGetters(['sidebar', 'menus'])
  },
  methods: {
    ...mapActions('sidebar', ['setStatus'])
  },
  watch: {
    sidebar(val) {
      this.active = val
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
  background: var(--white);
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
    background-image: linear-gradient(var(--white) 50%, var(--gray) 150%);
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
  box-shadow: 0 0 0px 1.4px var(--gray);

  svg {
    fill: var(--gray);
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
    transform: translateX(20px);
    transition-timing-function: ease-in-out;
  }
}

a,
a:hover {
  color: var(--black) !important;
}

// width 192px
</style>
