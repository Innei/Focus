<template>
  <client-only>
    <div class="comment-box">
      <h1 class="comment-title">
        快来评论吧~
      </h1>
      <div
        class="user flex"
        :class="{ full: viewport && (viewport.mobile || viewport.hpad) }"
      >
        <el-avatar :size="50" :src="avatar" class="user-avatar">
          <i class="el-icon-user-solid" />
        </el-avatar>
        <input
          v-model="comment.author"
          type="text"
          name="author"
          placeholder="昵称 *:"
          required
        />
        <input
          v-model="comment.mail"
          type="text"
          name="mail"
          placeholder="电邮 *:"
          required
        />
        <input
          v-model="comment.url"
          type="text"
          name="url"
          placeholder="网址: "
        />
      </div>
      <div class="text">
        <textarea
          ref="textarea"
          v-model="comment.text"
          placeholder="快来评论吧 (*≧ω≦)ﾉ"
          name="text"
        />
      </div>
      <div style="text-align: right">
        <el-button type="primary" @click="handleComment" round
          >写好了~</el-button
        >
      </div>
    </div>
  </client-only>
</template>
<script>
import { mapGetters } from 'vuex'
import { Comment } from '~/api'
import { avatarFromMail, isMail } from '~/utils'
export default {
  props: {
    pid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comment: {
        text: '',
        author: '',
        url: '',
        mail: ''
      }
    }
  },
  computed: {
    ...mapGetters(['viewport']),
    avatar() {
      return this.comment.mail && isMail(this.comment.mail)
        ? avatarFromMail(this.comment.mail)
        : null
    }
  },
  methods: {
    async handleComment() {
      const data = await Comment(this.$axios, 'comment')(this.pid, this.comment)
      if (data.ok) {
        this.$message.success('评论成功')
        this.comment = Object.assign(
          {},
          {
            text: '',
            author: '',
            url: '',
            mail: ''
          }
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.text {
  position: relative;
  box-sizing: border-box;

  textarea {
    height: 100px;
    margin-bottom: 0.8rem;
  }
}

.flex {
  display: flex;
  justify-content: space-between;
  &.full {
    flex-wrap: wrap;
    input {
      margin-right: 0 !important;
      width: 100% !important;
    }
  }
}
.user {
  box-sizing: border-box;
  input {
    width: calc(100% - 2rem);
    margin-bottom: 1rem;
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}
.comment-box {
  margin-top: 1rem;
  width: 100%;
  position: relative;
}
.comment-title {
  font-weight: 100;
  font-size: 1.2rem;
  font-family: $Heiti;
  margin: 1rem 0;
}
.comment-title::before {
  content: '';
  padding-left: 0.75em;
  border-left: 2px solid map-get($map: $material, $key: 'main');
}
textarea,
input {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: 0;
  // background-color: var(--gwhite);
  resize: vertical;
  min-height: 34px;
  padding: 6px 8px;
  font-size: 16px;
  line-height: 20px;
  vertical-align: middle;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
  transition: box-shadow 0.5s;
  &:focus {
    border-color: map-get($map: $material, $key: 'main');
    outline: none;
    box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075),
      0 0 0 0.2em rgba(3, 102, 214, 0.3);
  }
}
.user-avatar {
  position: absolute;
  left: -80px;
}
@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .user-avatar {
    display: none;
  }
}
</style>
