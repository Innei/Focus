<template>
  <div class="comment-root">
    <div class="comment-single">
      <el-avatar :size="50" :src="avatar" class="user-avatar">
        <i class="el-icon-user-solid" />
      </el-avatar>
      <div class="comment-meta">
        <span class="comment-author"
          ><a :href="comment.url" rel="external nofollow" target="_blank">{{
            comment.author
          }}</a></span
        >
        <time class="comment-time">{{ time }}</time>
        <span :id="`comment-${comment.key}`" class="key">{{
          comment.key
        }}</span>
        <span class="comment-reply"
          ><a rel="nofollow" @click="handleReply">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="reply"
              class="svg-inline--fa fa-reply fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"
              ></path></svg></a
        ></span>
      </div>
      <div class="comment-content" v-html="md"></div>
    </div>
    <Box
      v-if="reply"
      ref="reply-box"
      :cid="cid"
      @replyok="handleClose"
      @refresh="$emit('refresh')"
      @cancel="handleClose"
    />
    <div
      v-if="comment.children && comment.children.length > 0"
      class="comment-children"
    >
      <CommentItem
        v-for="child in comment.children"
        :key="child._id"
        :comment="child"
        :at="comment.author"
        class="children"
        @refresh="$emit('refresh')"
        @reply="$emit('reply')"
        @over="$emit('over')"
      />
    </div>
  </div>
</template>

<script>
import Box from './CommentBox'
import { fromNow, avatarFromMail, isMail } from '~/utils'
import MD from '~/core/markdown'
export default {
  name: 'CommentItem',
  components: {
    Box
  },

  props: {
    comment: {
      type: Object,
      required: true
    },
    at: {
      type: String
    }
  },
  data() {
    return {
      reply: false,
      cid: null
    }
  },
  computed: {
    md() {
      return new MD().renderText(
        (this.at ? `@${this.at} ` : '') + this.comment.text
      )
    },
    time() {
      return fromNow(this.comment.created)
    },
    avatar() {
      return this.comment.mail && isMail(this.comment.mail)
        ? avatarFromMail(this.comment.mail)
        : null
    }
  },
  methods: {
    handleReply(e) {
      // console.log(e)
      // console.log(this.send)
      this.$emit('reply')
      this.cid = this.comment._id
      this.reply = true

      // console.log(this.$refs)
    },
    handleClose() {
      this.reply = false
      this.cid = null
      this.$emit('over')
    }
  }
}
</script>
<style lang="scss" scoped>
.comment-single {
  position: relative;
  padding-left: 4em;
  margin-bottom: 1.5em;
  box-sizing: border-box;
  font-family: $Heiti;

  &:hover {
    .comment-meta .comment-reply a {
      opacity: 1;
    }
  }
  .user-avatar {
    position: absolute;
    top: 0;
    left: 0;
  }

  .comment-meta {
    margin-bottom: 0.25em;
    > * {
      margin-right: 0.8em;
    }
    a {
      color: map-get($map: $material, $key: 'main');
      &:hover {
        color: map-get($map: $material, $key: 'dark');
      }
    }
    .comment-reply {
      position: absolute;
      right: 0;

      a {
        width: 10px;
        opacity: 0;
        transition: color 0.5s, opacity 0.2s;
      }
    }
  }
  .comment-content {
    font-size: 0.9rem;
  }
  time,
  .key {
    font-size: 0.8rem;
    color: var(--gray);
  }
}
.children {
  padding-left: 1rem;
}
</style>
