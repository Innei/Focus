import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/avatar.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/button.css'

import Vue from 'vue'
import { Message, Avatar, Form, FormItem, Input, Button } from 'element-ui'
Vue.prototype.$message = Message
;[Avatar, Form, FormItem, Input, Button].map((plugin) => Vue.use(plugin))

// inject to nuxt ctx
export default ({ app }, inject) => {
  app.$message = Message
}
