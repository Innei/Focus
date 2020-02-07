<template>
  <client-only>
    <div id="comment">
      <Box v-if="!reply" :pid="pid" @refresh="getList()" />
      <div v-else class="no-comment flex center">
        <span>
          正在回复...
        </span>
      </div>
      <Item
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
        @reply="handleReply"
        @refresh="getList()"
        @over="handleReplyOver"
      />
    </div>
  </client-only>
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
  props: {
    pid: {
      type: String,
      required: true
    }
  },
  data() {
    return { comments: [], reply: false }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async getList() {
      const { data } = await Comment(this.$axios, 'getList')(this.pid)
      this.comments = { ...data }
    },
    handleReply(e) {
      this.reply = true
    },
    handleReplyOver() {
      this.reply = false
    }
  }
}
</script>

<style lang="scss" scoped>
#comment {
  position: relative;
  width: 100%;
  margin-top: 1rem;
  // overflow: hidden;
}
.no-comment {
  height: 150px;
  background-color: #eee;
  border: 3px dotted #666;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}
</style>
