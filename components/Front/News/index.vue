<template>
  <section class="news">
    <div class="news-header">
      <div class="title">
        <div class="icon">X</div>
        <div class="text">tttt</div>
      </div>
      <div class="more-icon">
        <!-- <nuxt-link> </nuxt-link> -->
      </div>
    </div>
    <div class="content"></div>
  </section>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.news-header {
  .title {
    color: var(--black);
    font-weight: 700;
    position: relative;
    display: flex;
    align-items: center;
    border-left: 2px solid map-get($map: $material, $key: 'main');
    .icon {
      top: 0;
      left: 0;
      padding: 1rem 1em;
      border-radius: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
