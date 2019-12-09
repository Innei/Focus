<template>
  <nuxt-link :to="link">
    <div class="nav-item">
      <div class="icon" :class="icon">
        <slot name="svg" />
      </div>

      <div class="text">
        {{ text }}
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: ['icon', 'text', 'link']
}
</script>

<style lang="scss" scoped>
.nav-item {
  overflow: hidden;
  position: relative;
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 0px 1.4px #434d54;
    float: left;
  }
  .text {
    float: left;
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    left: 64px;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.5s;
    &:hover {
      opacity: 1;
    }
  }
  &::after {
    content: '';
    clear: both;
  }
}
</style>
