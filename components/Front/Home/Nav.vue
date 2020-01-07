<template>
  <nav>
    <nuxt-link
      v-for="link in links"
      :key="link.to"
      :class="{ active: link.to === $route.fullPath }"
      :to="link.to"
      ><li>
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
  a {
    position: relative;
  }
  a {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    position: relative;
  }
  a:not(.active) {
    &::after {
      opacity: 0;
    }
  }

  a::after {
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
  a:hover::after {
    width: 80%;
  }
}
</style>
