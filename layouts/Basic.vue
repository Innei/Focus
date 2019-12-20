<template>
  <div id="basic-layout">
    <div class="wrap">
      <nuxt />
      <slot />
    </div>
  </div>
</template>

<style scoped>
#basic-layout {
  padding: 64px 64px 0;
}
</style>
