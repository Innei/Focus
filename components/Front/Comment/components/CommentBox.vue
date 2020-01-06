<template>
  <div class="comment-box row">
    <div class="user col">
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
    <div class="text col">
      <textarea
        ref="textarea"
        v-model="comment.text"
        placeholder="快来评论吧 (*≧ω≦)ﾉ"
        name="text"
      />

      <button @click="handleComment" class="btn">写好了~</button>
    </div>
  </div>
</template>
<script>
import { Comment } from '~/api'

// import qs from 'qs'
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
.row {
  padding: 0 1em;
  margin-bottom: 2em;
  display: flex;
  flex-wrap: wrap;
}
.text {
  position: relative;
  box-sizing: border-box;

  textarea {
    height: 100px;
    margin-bottom: 0.8rem;
  }
}
.col {
  max-width: 50%;
  flex: 0 0 50%;
}
.user {
  box-sizing: border-box;
  input {
    width: calc(100% - 2rem);
    margin-bottom: 1rem;
  }
}
.comment-box {
  width: 100%;
  display: flex;
  position: relative;
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
.btn {
  color: #fff;
  background: map-get($map: $material, $key: 'main');
  cursor: pointer;
  padding: 0.5em 1em;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid transparent;
  flex: 0 0 10%;
  transition: background 0.5s;
  outline: 0;
  &:hover {
    background: map-get($map: $material, $key: 'dark');
  }
  &:active,
  &:focus {
    background: map-get($map: $material, $key: 'light');
  }
}

@media (max-width: map-get($map: $viewports, $key: 'mobile')) {
  .col {
    flex: 0 0 100%;
    padding: 0 1em;
    max-width: 100%;
  }
}
</style>
