<template>
  <Home class="center">
    <div class="me">
      <div class="avatar">
        <img :src="config.avatar" :alt="config.username" />
      </div>
      <h1 class="title">
        {{ config.title }}
      </h1>
      <div class="desc">
        {{ config.desc }}
      </div>
      <div class="links"></div>
    </div>

    <News />
  </Home>
</template>

<script>
import { mapGetters } from 'vuex'
import Home from '~/layouts/Home'
import News from '~/components/Front/News'

export default {
  components: {
    Home,
    News
  },
  computed: {
    ...mapGetters(['config'])
  }
}
</script>

<style lang="scss" scoped>
.me {
  width: 100%;
  text-align: center;
  margin-bottom: 5rem;

  .avatar img {
    height: 150px;
    width: 150px;
    object-fit: cover;
    border-radius: 50%;
  }
}
.center {
  margin: 0 10rem;
}

@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .center {
    margin: 0 3rem;
  }
}
</style>
