<template>
  <swiper :options="swiperOption" class="swiper" ref="swiper"> </swiper>
</template>

<script>
import 'swiper/dist/css/swiper.css'

import { swiper } from 'vue-awesome-swiper'
import Slide from './slide'

export default {
  components: {
    swiper,
    Slide
  },

  data() {
    return {
      activeItem: 0,
      swiperOption: {
        slidesPerView: 6,
        spaceBetween: 16,
        slideToClickedSlide: true,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        autoplay: false,
        delay: 3000,
        mousewheel: true
        // freeMode: true,
      },
      interval: null
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
