<template>
  <ul class="tortree">
    <li
      v-for="i in tree"
      :key="i.name"
      :class="{ active: isActive(i.y, i.nexty, i.name) }"
      @click="scrollTo(i.y, i.name)"
    >
      {{ i.name }}
    </li>
  </ul>
</template>

<script>
import { debounce } from '~/utils'
export default {
  props: {
    tree: Array
  },
  data() {
    return { y: 0, name: '' }
  },
  mounted() {
    document.onscroll = debounce(() => {
      this.y = document.documentElement.scrollTop
      // if (location.hash !== this.name) {
      //   location.hash = this.name
      // }
    }, 13)
  },
  destroyed() {
    document.onscroll = null
  },
  methods: {
    scrollTo(y, name) {
      // location.hash = name
      // TODO HASH Change
      window.scrollTo({
        top: y,
        left: 0,
        behavior: 'smooth'
      })
    },
    isActive(y, nexty, name) {
      const isActive = this.y >= y && this.y < nexty
      // if (isActive) {
      //   this.name = name
      // }
      return isActive
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  font-size: 13.6px;
  position: fixed;
}
li {
  color: #888;
  font-family: -apple-system, sans-serif;
  list-style: none;
  margin: 1ch;
  position: relative;
  cursor: pointer;

  &.active::before {
    content: '';
    position: absolute;
    left: -2ch;
    top: 50%;
    transform: translateY(-50%);

    width: 5px;
    height: 5px;
    background-color: map-get($map: $material, $key: 'shallow');
    border-radius: 88%;
  }
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
