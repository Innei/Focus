<template>
  <nav>
    <nuxt-link :to="link.to" v-for="link in links" :key="link.to"
      ><li :class="{ active: link.to === $route.fullPath }">
        {{ link.name }}
      </li></nuxt-link
    >
  </nav>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
nav {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;

  li {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    position: relative;
  }
  li:not(.active) {
    &::after {
      opacity: 0;
    }
  }
  li::after {
    content: '';
    position: absolute;
    opacity: 1;
    bottom: 0;
    height: 2px;
    width: 30%;
    left: 0;
    right: 0;
    background: currentColor;
    margin: auto;
    transition: width 0.5s, opacity 0.5s;
  }
  li:hover::after {
    width: 80%;
  }
}
</style>
