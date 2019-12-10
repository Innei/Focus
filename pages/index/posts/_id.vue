<template>
  <div class="">
    根据 ID
  </div>
</template>

<script>
export default {
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  }
}
</script>

<style></style>
