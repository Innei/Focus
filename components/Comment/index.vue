<template>
  <div id="comment" data-cid="1">
    <Box :pid="pid" />
    <Item v-for="comment in comments" :key="comment._id" :comment="comment" />
  </div>
</template>

<script>
import Item from './components/CommentItem'
import Box from './components/CommentBox'
import { Comment } from '~/api'
export default {
  components: {
    Item,
    Box
  },
  data() {
    return { comments: [] }
  },
  props: {
    pid: {
      type: String,
      required: true
    }
  },
  async created() {
    const { data } = await Comment(this.$axios, 'getList')(this.pid)
    this.comments = { ...data }
  }
}
</script>

<style lang="scss" scoped>
#comment {
  position: relative;
  width: 100%;
  // overflow: hidden;
}
</style>
