<template>
  <div class="swiper-root">
    <div class="abs bg-overlay">
      <swiper ref="background" :options="swiperOption" class="abs">
        <swiper-slide
          v-for="(card, i) in news"
          :key="card._id"
          class="background"
        >
          <progressive-background
            :placeholder="
              card.options && card.options.img ? card.options.img : randomImg(i)
            "
            :src="
              card.options && card.options.img ? card.options.img : randomImg(i)
            "
        /></swiper-slide>
      </swiper>
    </div>
    <swiper ref="main" :options="mainOptions" class="swiper">
      <slide
        v-for="(card, i) in news"
        :key="card._id"
        :img="
          card.options && card.options.img ? card.options.img : randomImg(i)
        "
        :data="card"
      />

      <div slot="button-prev" class="swiper-button-prev"></div>
      <div slot="button-next" class="swiper-button-next"></div>
      <div slot="pagination" class="swiper-pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'swiper/dist/css/swiper.css'
import Slide from './NewsSlide'
export default {
  components: {
    Slide
  },
  props: {
    news: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      swiperOption: {}
    }
  },
  mounted() {
    setTimeout(() => {
      const background = this.$refs.background.swiper
      const main = this.$refs.main.swiper
      main.controller.control = background
      background.controller.control = main
    })
  },
  methods: {
    randomImg(index) {
      return `https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302&index=${index}`
    }
  },
  computed: {
    mainOptions() {
      return {
        spaceBetween: 30,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay: 3500
        },
        ...this.swiperOption
      }
    },
    ...mapGetters(['sidebar'])
  },
  watch: {
    sidebar() {
      setTimeout(() => {
        this.$refs.main.swiper.update({
          updateTranslate: true
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-button-prev,
.swiper-button-next {
  opacity: 0;
  transition: opacity 0.5s;
  outline: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23fff'%2F%3E%3C%2Fsvg%3E");
}
.swiper-button-prev {
  transform: rotate(180deg);
}
.swiper-button-disabled {
  opacity: 0 !important;
}
.swiper {
  border-radius: 8px;
  &:hover {
    .swiper-button-prev,
    .swiper-button-next {
      opacity: 1;
    }
  }
}
.abs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(68, 68, 68, 0.24902);
  height: 30rem;
  pointer-events: none;
  .background {
    width: 100%;
    height: 100%;
    background: center/cover;
    filter: blur(5px) brightness(0.8);
    perspective: 300px;
    transform: scale(1.2) translateZ(-100px);
    transition: transform 1.5s;
    &.swiper-slide-next,
    &.swiper-slide-prev {
      z-index: -99;
    }
  }
}
.swiper-root {
  z-index: -1;
  margin-bottom: 8rem;
  min-height: 300px;
}
.abs.overlay {
  background-image: linear-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1)
  );
}
</style>

<style lang="scss">
.swiper-pagination-bullet-active {
  background: var(--shallow);
}
.progressive-background {
  position: absolute;
  z-index: -99;
  border-radius: 8px;
}
</style>
