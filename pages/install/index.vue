<template>
  <div class="center">
    <client-only>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>仅仅几步，即可完成初始化</span>
        </div>
        <header>
          <el-steps :active="active" finish-status="success" align-center>
            <el-step
              title="步骤 1"
              icon="el-icon-user"
              description="建立一个新的账号"
            ></el-step>
            <el-step
              title="步骤 2"
              icon="el-icon-edit"
              description="填写一些介绍，用于 SEO"
            ></el-step>
            <el-step
              title="步骤 3"
              icon="el-icon-check"
              description="一切就绪"
            ></el-step>
          </el-steps>
        </header>
        <transition name="fade" mode="out-in">
          <main :key="1" v-if="active === 0">
            <el-form label-position="right" label-width="80px" :model="master">
              <el-form-item label="用户名">
                <el-input v-model="master.username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  type="password"
                  v-model="master.password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="确定密码">
                <el-input
                  type="password"
                  v-model="master.vaildPassword"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="个人邮箱">
                <el-input
                  type="email"
                  v-model="master.mail"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="个人主页">
                <el-input v-model="master.url" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </main>

          <main :key="2" v-if="active === 1">
            <el-form
              label-position="right"
              label-width="80px"
              :model="description"
            >
              <el-form-item label="博客标题">
                <el-input v-model="description.title"> </el-input>
              </el-form-item>

              <el-form-item label="描述">
                <el-input v-model="description.desc"> </el-input>
              </el-form-item>
              <el-form-item label="关键词">
                <el-input v-model="description.keywords"> </el-input>
              </el-form-item>
            </el-form>
          </main>
        </transition>
        <footer style="text-align: center">
          <el-button type="primary" style="margin-top: 12px;" @click="next"
            >下一步</el-button
          >
        </footer>
      </el-card>
    </client-only>
  </div>
</template>

<script>
import Vue from 'vue'
import { Card, Steps, Step, Button, Form, FormItem, Input } from 'element-ui'
import 'element-ui/lib/theme-chalk/steps.css'
import 'element-ui/lib/theme-chalk/step.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/input.css'

Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

export default {
  data() {
    return {
      active: 0,
      master: {
        username: '',
        password: '',
        vaildPassword: '',
        url: '',
        mail: ''
      },
      description: {
        title: '',
        desc: '',
        keywords: [],
        domain: undefined
      }
    }
  },
  mounted() {
    this.description.domain = location.origin
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
    }
  }
}
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>

<style lang="scss" scoped>
.center {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

main {
  margin-top: 2rem;
}
</style>
