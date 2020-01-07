<template>
  <Basic>
    <Loading v-show="!data" />
    <Note v-if="data" :data="data" />

    <div :class="{ 'move-top': showSwiper }" class="btn-wrap">
      <Btn
        v-if="next"
        :class="{ show: btnShow }"
        class="right"
        @click.native="$router.push(`/notes/${next.nid}`)"
      >
        <i class="el-icon-arrow-right"></i>
      </Btn>
      <Btn
        :class="{ show: btnShow }"
        class="right item"
        @click.native="showSwiper = !showSwiper"
        ><i class="el-icon-more"></i
      ></Btn>
      <Btn
        v-if="prev"
        :class="{ show: btnShow }"
        class="left"
        @click.native="$router.push(`/notes/${prev.nid}`)"
        ><i class="el-icon-arrow-left"></i
      ></Btn>
    </div>
    <transition name="slide-down">
      <div v-show="showSwiper" id="swiper" class="overlay">
        <client-only>
          <Swiper ref="swiper" class="swiper">
            <Slide
              v-for="i in list"
              :key="i._id"
              :date="new Date(i.created)"
              :title="i.title"
              :is-active="
                $route.params.id == i.nid || $route.params.id === i._id
              "
              @click.native="handleTo(i.nid)"
            />
          </Swiper>
        </client-only>
      </div>
    </transition>
  </Basic>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mdit from 'markdown-it'
import { throttle } from '~/utils'

import Basic from '~/layouts/Basic'
import Loading from '~/components/Front/Loading'
import Rest from '~/api/rest'
import Notes from '~/api/notes'
import Note from '~/components/Front/Note'
import Btn from '~/components/Front/Note/components/btn'
import Swiper from '~/components/Front/Note/components/Swiper'
import Slide from '~/components/Front/Note/components/Swiper/slide'

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
    Swiper,
    Slide
  },
  async asyncData({ app, params, redirect }) {
    // valid params.id
    const isNum = /^\d*$/.test(params.id)
    if (!isNum) {
      return redirect('/404')
    }
    try {
      const data = await Rest(app.$axios, 'getOne', 'Note')(params.id)
      const list = await Notes(app.$axios, 'getList')(params.id)
      data.data.text = md.render(data.data.text)
      return {
        data: data.data,
        prev: data.prev,
        next: data.next,
        list: list.data.reverse()
      }
    } catch (e) {}
  },
  data() {
    return {
      data: undefined,
      list: undefined,
      showSwiper: false,
      btnShow: true,
      currentY: 0
    }
  },
  mounted() {
    if (this.data) {
      this.setStatus(false)
    }

    window.onscroll = throttle(() => {
      const currentY = document.documentElement.scrollTop
      this.btnShow = this.currentY >= currentY
      this.currentY = currentY
    }, 13)
  },
  methods: {
    ...mapActions('Navigation', ['setStatus']),
    handleTo(nid) {
      this.$router.push('/notes/' + nid)
    }
  },
  computed: {
    ...mapGetters(['navActive'])
  },
  watch: {
    showSwiper(val) {
      if (val) {
        this.$refs.swiper.$refs.swiper.swiper.slideTo(
          this.list.findIndex(
            (item) =>
              item.nid === parseInt(this.$route.params.id) ||
              item._id === this.$route.params.id
          ),
          500
        )
      }
    }
  },
  destroyed() {
    window.onscroll = null
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
    transition: transform 0.5s;
    transform: scale(0);
    background-color: var(--white);
    &.show {
      transform: scale(1);
    }
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
