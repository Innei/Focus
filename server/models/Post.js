const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const schema = new Schema({
  title: { type: String, index: 1, trim: true },
  slug: { type: String, index: { unique: true }, required: true },
  text: String,
  summary: String,
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  created: {
    type: Date,
    default: new Date(),
    index: -1
  },
  modified: {
    type: Date,
    default: new Date(),
    index: -1
  },
  status: { type: String, default: 'Published' },
  commentsNum: { type: Number, default: 0 },
  type: { type: String, default: 'post' }
})
schema.plugin(uniqueValidator)

// schema.pre('updateOne', async function(next) {
//   await this.update({}, { modified: new Date() })
//   // 这里写了个 BUG 导致了 死循环 栈溢出 导致 程序崩溃 记录一下
//   // update 钩子函数中调用 update 无限循环
//   //
//   next()
// })

// 后置钩子函数 监听 updateOne 实例方法 更新修改时间
schema.post('updateOne', async function(doc) {
  if (doc.result.nModified) {
    await this.updateMany({}, { modified: new Date() })
  }
})

module.exports = model('Post', schema)
