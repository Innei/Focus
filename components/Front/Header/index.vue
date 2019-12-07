<template>
  <div id="header">
    <Nav />
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
</style>
