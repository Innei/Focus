<template>
  <div id="header">
    <Nav class="navigation" />
  </div>
</template>

<script>
import Nav from './Nav'
export default {
  components: { Nav }
}
</script>

<style lang="scss" scoped>
#header {
  position: absolute;
  width: (64 * 3) + px;
  top: 0;
  height: 100vh;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    width: 1px;
    background-image: linear-gradient(
      #fff 50%,
      map-get($map: $colors, $key: 'gray') 150%
    );
    opacity: 0.4;
  }
}
.navigation {
  opacity: 0.6;
  transition: opacity 0.6s;
  &:hover {
    opacity: 1;
  }
}
</style>
