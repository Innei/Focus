<template>
  <div
    id="bigHead"
    :style="viewport && viewport.mobile ? 'padding-top: 3rem' : ''"
  >
    <div class="head-name">{{ name }}</div>
    <div class="head-desc">{{ desc }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    name: String,
    desc: String
  },

  // methods: {
  //   ...mapActions('viewport', ['updateViewport'])
  // },
  computed: {
    ...mapGetters(['viewport'])
  }
}
</script>

<style lang="scss" scoped>
#bigHead {
  margin-top: -20px;
  background: no-repeat center;
  background-size: cover;
  position: relative;
  padding-top: 140px;
}
.head-name {
  color: var(--shallow);
  padding: 80px 35px 30px 35px;
  font-size: 30px;
  font-weight: 600;
  font-style: normal;
  line-height: 1.5em;
  text-align: center;
}
.head-desc {
  text-align: center;
}
</style>
