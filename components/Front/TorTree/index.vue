<template>
  <ul class="tortree">
    <li
      :class="'h' + i.level"
      v-for="i in tree"
      :key="i.name"
      @click="scrollTo(i.y, i.name)"
    >
      {{ i.name }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tree: Array
  },
  methods: {
    scrollTo(y, name) {
      location.hash = name
      window.scrollTo(0, y)
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  font-size: 13.6px;
  border-left: 2px solid map-get($map: $material, $key: 'shallow');
  position: fixed;
  overflow: hidden;
}
li {
  color: #888;
  font-family: -apple-system, sans-serif;
  list-style: none;
  margin: 1ch;
  position: relative;
  cursor: pointer;
  @for $var from 1 through 6 {
    &.h#{$var} {
      margin-left: 1ch + $var * 0.5ch;
    }
  }
  &::before {
    content: '';
    position: absolute;
    left: -53px;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    border-top: 2px solid map-get($map: $material, $key: 'shallow');
  }
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
