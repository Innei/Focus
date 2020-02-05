<template>
  <div class="swiper-root">
    <div class="abs bg-overlay">
      <swiper :options="swiperOption" class="abs" ref="background">
        <!-- <swiper-slide
          class="background"
          :style="{
            backgroundImage:
              card.options && card.options.img
                ? `url(${card.options.img})`
                : `url(${randomImg(i)})`
          }"
          v-for="(card, i) in news"
          :key="card._id"
        ></swiper-slide> -->
        <swiper-slide
          class="background"
          v-for="(card, i) in news"
          :key="card._id"
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
    <swiper :options="mainOptions" class="swiper" ref="main">
      <slide
        v-for="(card, i) in news"
        :key="card._id"
        :img="
          card.options && card.options.img ? card.options.img : randomImg(i)
        "
        :data="card"
      />

      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import Slide from './NewsSlide'
export default {
  props: {
    news: {
      type: Array,
      required: true
    }
  },
  components: {
    Slide
  },
  data() {
    return {
      swiperOption: {}
    }
  },
  methods: {
    randomImg(index) {
      return `https://img.xjh.me/random_img.php?type=bg&ctype=nature&return=302&index=${index}`
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
    transform: scale(1.1) translateZ(-100px);
    &.swiper-slide-next,
    &.swiper-slide-prev {
      z-index: -99;
    }
  }
}
.swiper-root {
  z-index: -1;
  margin-bottom: 8rem;
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
