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
                <el-tag
                  :key="tag"
                  v-for="tag in description.keywords"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Keyword</el-button
                >
              </el-form-item>
            </el-form>
          </main>

          <main :key="3" v-if="active === 2">
            <el-form label-position="right" label-width="100px" :model="other">
              <el-form-item label="当前博客域名">
                <el-input
                  :placeholder="other.host"
                  v-model="other.host"
                  class="input-with-select"
                >
                  <el-select
                    v-model="other.protocol"
                    slot="prepend"
                    placeholder="请选择"
                  >
                    <el-option label="http://" value="http://"></el-option>
                    <el-option label="https://" value="https://"></el-option>
                  </el-select>
                </el-input>
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
import {
  Card,
  Steps,
  Step,
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Tag,
  Option
} from 'element-ui'

import 'element-ui/lib/theme-chalk/steps.css'
import 'element-ui/lib/theme-chalk/step.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/select-dropdown.css'
import 'element-ui/lib/theme-chalk/tag.css'
import 'element-ui/lib/theme-chalk/option.css'

Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Tag)
Vue.use(Option)

export default {
  data() {
    return {
      active: 0,
      inputVisible: false,
      inputValue: '',
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
        keywords: []
      },
      other: {
        domain: undefined,
        protocol: undefined,
        host: undefined
      }
    }
  },
  mounted() {
    this.other.host = location.host
    this.other.protocol = location.protocol + '//'
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
    },
    handleClose(tag) {
      this.description.keywords.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.description.keywords.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }

  // computed: {
  //   protocol() {
  //     return this.other?.domain?.match(/^(http.*?:\/\/)/)[1]
  //   },

  // }
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-select .el-input {
  width: 6rem;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
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
