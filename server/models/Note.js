const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  nid: { type: Number, index: 1 },
  title: { type: String, index: 1, trim: true },
  text: { type: String, trim: true },
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
  mood: { type: String },
  weather: String,
  hide: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  },
  count: {
    read: {
      type: Number,
      default: 0
    },
    like: {
      type: Number,
      default: 0
    }
  },
  options: {}
})
schema.plugin(uniqueValidator)
// 后置钩子函数 监听 updateOne 实例方法 更新修改时间
schema.post('updateOne', async function(doc) {
  if (doc.result.nModified) {
    await this.updateMany({}, { modified: new Date() })
  }
})
module.exports = model('Note', schema)
