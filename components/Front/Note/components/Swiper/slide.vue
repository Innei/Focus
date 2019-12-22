<template>
  <swiper-slide class="card" :class="{ active: isActive }">
    <div class="normal" v-if="!isBtn">
      <div class="header">
        <div class="date">{{ date.getDate() || 'N' }}</div>
        <div class="type">
          <div class="xtop">随记</div>
          <div class="bottom">
            {{
              `${date.getMonth() + 1} / ${String(date.getFullYear()).substr(2)}`
            }}
          </div>
        </div>
      </div>
      <div class="body">{{ title }}</div>
    </div>
    <div class="btn next_btn prev_btn" v-else>
      <slot />
    </div>
  </swiper-slide>
</template>

<script>
// import { swiperSlide } from 'vue-awesome-swiper/dist/ssr'
import { mapGetters } from 'vuex'

export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      required: true
    },
    isBtn: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    }
  },
  components: {
    // swiperSlide
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style lang="scss" scoped>
.card {
  box-sizing: border-box;
  width: 15rem;
  height: 12rem;
  border-radius: 48px;
  background-color: #fff;
  will-change: backgroud;
  transition: background-color ease-in-out 0.8s, height 0.8s;
  color: #989fa7;
  padding: 2rem;
  user-select: none;
  box-shadow: inset 0px -8px 1px 0 rgba(255, 255, 255, 0.1),
    inset 1px 1px 7px 0 rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.01),
    2px 3px 5px 1px rgba(0, 0, 0, 0.02), 1px 2px 4px 0 rgba(255, 255, 255, 0.2);
  &.active {
    background-color: map-get($map: $colors, $key: 'gray');
    color: map-get($map: $colors, $key: 'white');
    height: 12.5rem;
    box-shadow: none;

    .header {
      .date {
        color: map-get($map: $colors, $key: 'white');
      }

      .type {
        .xtop {
          color: map-get($map: $colors, $key: 'gwhite');
        }

        .bottom {
          color: map-get($map: $colors, $key: 'gwhite');
        }
      }
    }
  }

  .header {
    display: flex;
    align-items: center;

    .date {
      font-size: 3rem;
      color: #09233a;
    }

    .type {
      margin-left: 1rem;
      display: flex;
      flex-direction: column;

      .top {
        flex: 1;
        color: #acb3b7;
      }

      .bottom {
        color: #072b47;
      }
    }
  }

  &.active .body {
    color: map-get($map: $colors, $key: 'gwhite');
  }

  .body {
    line-height: 1.8;
    color: #9599a0;
  }
}
.btn {
  background: transparent !important;

  &.next_btn.prev_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 3rem;
    height: 100%;
    width: 100%;
    position: relative;
    transition: color 0.5s;
  }

  &.next_btn.prev_btn:hover {
    color: #eee;
  }

  &.next_btn.prev_btn::before {
    content: '';
    position: absolute;
    height: 12rem;
    width: 12rem;
    z-index: -1;
    transition: opacity 0.5s;
    opacity: 0;
    background: radial-gradient(9rem circle, #9599a0 30%, transparent 31%);
    background-position: center center;
  }

  &.next_btn.prev_btn:hover::before {
    opacity: 0.5;
  }
}
</style>
