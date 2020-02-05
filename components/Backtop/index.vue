<template>
  <div class="btn-wrap">
    <Btn class="right" :class="{ show: btnShow }" @click.native="handleBackTop">
      <i class="el-icon-arrow-up"></i>
    </Btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Btn from '~/components/Note/components/btn'

export default {
  components: {
    Btn
  },

  methods: {
    handleBackTop() {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
      })
    }
  },
  computed: {
    ...mapGetters(['scroll']),
    btnShow() {
      return this.scroll === 'up'
    }
  }
}
</script>
