<template>
  <swiper-slide class="card">
    <progressive-background :placeholder="this.img" :src="this.img" :blur="0" />
    <h1 class="title">
      {{ data.title }}
    </h1>
    <nuxt-link :to="link" v-text="'阅读'" class="link-btn" />
  </swiper-slide>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      return this.data.slug !== undefined ? 'post' : 'note'
    },
    link() {
      return this.type === 'post'
        ? `/posts/${
            this.data.categoryId ? this.data.categoryId.slug : 'null'
          }/${this.data.slug}`
        : `/notes/${this.nid}`
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  height: 300px;
  width: 100%;
  background-color: rgba(26, 26, 26, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  text-shadow: rgba(68, 68, 68, 0.74902) 1px 1px 1px;
  user-select: none;
  font-family: $Heiti;
}
.link-btn {
  margin-top: 1.2rem;
  border-radius: 4px;
  outline: none;
  border: 1px solid #fff;
  box-shadow: 0.5px 0.5px rgba(68, 68, 68, 0.74902);
  transition: background 0.5s, text-shadow 0.5s;
  padding: 0.3rem 1rem;
  &:hover {
    background: #fff;
    color: #000;
    text-shadow: none;
  }
}
</style>
