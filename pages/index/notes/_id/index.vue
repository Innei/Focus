<template>
  <Basic>
    <Loading v-show="!data" />
    <Note :data="data" v-if="data" />

    <div class="btn-wrap" :class="{ 'move-top': showSwiper }">
      <Btn
        class="right"
        v-if="next"
        @click.native="$router.push(`/notes/${next.nid}`)"
      >
        <i class="el-icon-arrow-right"></i>
      </Btn>
      <Btn class="right item" @click.native="showSwiper = !showSwiper"
        ><i class="el-icon-more"></i
      ></Btn>
      <Btn
        class="left"
        v-if="prev"
        @click.native="$router.push(`/notes/${prev.nid}`)"
        ><i class="el-icon-arrow-left"></i
      ></Btn>
    </div>
    <transition name="slide-down">
      <div id="swiper" v-show="showSwiper" class="overlay">
        <client-only>
          <Swiper :list="list" class="swiper" />
        </client-only>
      </div>
    </transition>
  </Basic>
</template>

<script>
import { Message } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'
import Mdit from 'markdown-it'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Rest from '~/api/rest'
import Notes from '~/api/notes'
import Note from '~/components/Front/Note'
import Btn from '~/components/Front/Note/components/btn'
import Swiper from '~/components/Front/Note/components/Swiper'

import '~/assets/scss/markdown/shizuku.scss'

const md = new Mdit({
  html: true,
  linkify: true,
  typographer: true
})

export default {
  components: {
    Basic,
    Loading,
    Note,
    Btn,
    Swiper
  },
  data() {
    return { data: undefined, list: undefined, showSwiper: false }
  },
  async asyncData({ app, params }) {
    const data = await Rest(app.$axios, 'getOne', 'Note')(params.id)
    const list = await Notes(app.$axios, 'getList')(params.id)
    if (data.ok && list.ok) {
      data.data.text = md.render(data.data.text)
      return {
        data: data.data,
        prev: data.prev,
        next: data.next,
        list: list.data
      }
    } else {
      Message.error({ message: data.msg || list.msg })
    }
  },
  mounted() {
    if (this.data) {
      this.setStatus(false)
    }
  },
  methods: {
    ...mapActions('Navigation', ['setStatus'])
  },
  computed: {
    ...mapGetters(['navActive'])
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1) 6%, transparent);
  // backdrop-filter: blur(5px);
}
#swiper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.btn-wrap {
  position: fixed;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  transition: bottom 0.5s;

  .btn {
    position: absolute;
  }
  &.move-top {
    bottom: 12rem;
  }

  .left {
    left: 2rem;
    bottom: 2rem;
  }
  .right {
    right: 2rem;
    bottom: 2rem;

    &.item {
      bottom: 6rem;
    }
  }
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.5s;
  transform: translateY(0);
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(100%);
}
</style>
