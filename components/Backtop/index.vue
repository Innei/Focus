<template>
  <div class="btn-wrap">
    <Btn class="right" :class="{ show: btnShow }" @click.native="handleBackTop">
      <i class="el-icon-arrow-up"></i>
    </Btn>
  </div>
</template>
<script>
import Btn from '~/components/Note/components/btn'
import { throttle } from '~/utils'
export default {
  components: {
    Btn
  },
  data() {
    return {
      btnShow: true
    }
  },
  mounted() {
    window.onscroll = throttle(() => {
      const currentY = document.documentElement.scrollTop
      this.btnShow = this.currentY >= currentY
      this.currentY = currentY
    }, 13)
  },
  destroyed() {
    window.onscroll = null
  },
  methods: {
    handleBackTop() {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
