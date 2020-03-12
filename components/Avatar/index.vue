<template>
  <div class="avatar-wrap" :style="{ height: `${size}px`, width: `${size}px` }">
    <div
      v-if="src"
      class="avatar-shadow"
      :style="{
        '--bg': `url(${src})`
      }"
    ></div>
    <el-avatar v-else :size="size" class="normal-shadow">
      <i class="el-icon-user-solid" />
    </el-avatar>
  </div>
</template>

<script>
import { Avatar } from 'element-ui'
export default {
  components: {
    elAvatar: Avatar
  },
  props: {
    size: {
      type: Number,
      default: 50
    },
    // eslint-disable-next-line vue/require-default-prop
    src: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-wrap {
  position: relative;
  z-index: 0;
}
.avatar-shadow {
  position: absolute;
  border-radius: 100%;
  // width: 200px;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  // height: 200px;
  background: var(--bg) no-repeat center/cover;
  display: inline-block;

  &::after {
    position: absolute;
    left: 0;
    top: 10%;
    z-index: -1;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    background: inherit;
    filter: blur(10px) brightness(80%) opacity(0.8);
    content: '';
    transform: scale(0.95);
  }
}
.normal-shadow {
  box-shadow: 0px 4px 13px -1px #c0c4cc;
}
</style>
