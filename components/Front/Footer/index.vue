<template>
  <div id="footer">
    <p>{{ year }} &copy;. Innei</p>
  </div>
</template>
<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
<style lang="scss" scoped>
#footer {
  padding: 2rem 0;
  text-align: center;
  left: 0;
  right: 0;
}
</style>
