<template>
  <div id="comment" data-cid="1">
    <Item />
    <Box :pid="pid" />
  </div>
</template>

<script>
import Item from './components/CommentItem'
import Box from './components/CommentBox'
export default {
  props: {
    pid: {
      type: String,
      required: true
    }
  },
  components: {
    Item,
    Box
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
