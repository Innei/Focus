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
import { swiperSlide } from 'vue-awesome-swiper'
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
    swiperSlide
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

  &.active {
    background-color: #6467f6;
    color: #fff;
    height: 15rem;

    .header {
      .date {
        color: #fff;
      }

      .type {
        .xtop {
          color: #c7caff;
        }

        .bottom {
          color: #b0b3f3;
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
    color: #c7caff;
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
