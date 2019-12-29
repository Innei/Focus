import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/message.css'
import Vue from 'vue'
import { Message } from 'element-ui'
Vue.prototype.$message = Message

// inject to nuxt ctx
export default ({ app }, inject) => {
  app.$message = Message
}
