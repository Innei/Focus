<template>
  <swiper :options="swiperOption" class="swiper" ref="swiper">
    <Slide
      v-for="i in list"
      :key="i._id"
      :date="new Date(i.created)"
      :title="i.title"
    />
  </swiper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { swiper } from 'vue-awesome-swiper/dist/ssr'
import Slide from './slide'

import 'swiper/dist/css/swiper.css'

export default {
  components: {
    // swiper,
    Slide
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeItem: 0,
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 16,
        slideToClickedSlide: true,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        autoplay: false,
        delay: 3000,
        mousewheel: true
        // freeMode: true,
      }
    }
  },

  computed: {
    ...mapGetters(['viewport'])
  },
  watch: {
    viewport(n) {
      this.updateSlidesPerview(n)
    }
  },
  mounted() {
    this.updateViewport()
  },
  methods: {
    ...mapActions('viewport', ['updateViewport']),
    updateSlidesPerview(n) {
      if (n.mobile) this.swiperOption.slidesPerView = 2
      else if (n.pad) this.swiperOption.slidesPerView = 3
      else if (n.hpad) this.swiperOption.slidesPerView = 4
      else if (n.widest) this.swiperOption.slidesPerView = 8
      else this.swiperOption.slidesPerView = 6
      this.$refs.swiper.swiper.destroy() // 先销毁
      this.$refs.swiper.mountInstance() // 后在加载
    }
  }
}
</script>

<style lang="scss">
.swiper-wrapper {
  @for $var from 0 to 6 {
    & > div.card:nth-child(#{$var + 1}n) {
      animation: scale 0.5s forwards;
      animation-delay: $var * 0.1s;
      transform: scale(0);
    }
  }
}
@keyframes scale {
  0% {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
<style lang="scss" scoped>
.swiper {
  padding: 0 1rem;
}
</style>
