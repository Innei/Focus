<template>
  <div class="">首页</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('Navigation', ['setStatus'])
  },
  mounted() {
    this.setStatus(true)
  }
}
</script>
