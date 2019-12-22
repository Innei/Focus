<template>
  <Basic>
    <Loading v-show="!data" />
    <Note :data="data" v-if="data" />

    <div :class="{ 'move-top': showSwiper }" class="btn-wrap">
      <Btn
        :class="{ show: btnShow }"
        v-if="next"
        @click.native="$router.push(`/notes/${next.nid}`)"
        class="right"
      >
        <i class="el-icon-arrow-right"></i>
      </Btn>
      <Btn
        :class="{ show: btnShow }"
        @click.native="showSwiper = !showSwiper"
        class="right item"
        ><i class="el-icon-more"></i
      ></Btn>
      <Btn
        :class="{ show: btnShow }"
        v-if="prev"
        @click.native="$router.push(`/notes/${prev.nid}`)"
        class="left"
        ><i class="el-icon-arrow-left"></i
      ></Btn>
    </div>
    <transition name="slide-down">
      <div id="swiper" v-show="showSwiper" class="overlay">
        <client-only>
          <Swiper ref="swiper" class="swiper">
            <Slide
              v-for="i in list"
              :key="i._id"
              :date="new Date(i.created)"
              :title="i.title"
              :isActive="
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
import { Message } from 'element-ui'
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
  data() {
    return {
      data: undefined,
      list: undefined,
      showSwiper: false,
      btnShow: true,
      currentY: 0
    }
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
        list: list.data.reverse()
      }
    } else {
      Message.error({ message: data.msg || list.msg })
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
          )
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
    background-color: map-get($map: $colors, $key: 'white');
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
