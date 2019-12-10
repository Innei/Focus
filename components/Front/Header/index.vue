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
}
.navigation {
  opacity: 0.6;
  transition: opacity 0.6s;
  &:hover {
    opacity: 1;
  }
}
</style>
