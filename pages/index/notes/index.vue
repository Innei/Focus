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
      <Btn
        class="right item"
        v-if="next"
        @click.native="showSwiper = !showSwiper"
        ><i class="el-icon-more"></i
      ></Btn>
    </div>
    <transition name="slide-down">
      <div id="swiper" v-show="showSwiper" class="overlay">
        <Swiper :list="list" class="swiper" />
      </div>
    </transition>
  </Basic>
</template>

<script>
import { Message } from 'element-ui'
import { mapActions } from 'vuex'
import Mdit from 'markdown-it'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Notes from '~/api/notes'
import Rest from '~/api/rest'
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
    return {
      data: undefined,
      next: undefined,
      list: undefined,
      showSwiper: false
    }
  },
  async created() {
    const data = await Notes(this.$axios, 'getLastest')()
    const list = await Rest(this.$axios, 'getRecently', 'Note')(1, 10)
    if (data.ok && list.ok) {
      this.data = data.data
      this.data.text = md.render(this.data.text)
      this.next = data.next

      this.list = list.data

      this.setStatus(false)
      history.pushState(
        null,
        this.data.title,
        `${location.origin}/notes/${this.data.nid}`
      )
    } else {
      Message.error({ message: data.msg || list.msg })
    }
  },

  methods: {
    ...mapActions('Navigation', ['setStatus'])
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
  bottom: 10px;
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

  &.move-top {
    bottom: 12rem;
  }

  .right {
    position: absolute;
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
