const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const schema = new Schema({
  title: { type: String, index: 1, trim: true },
  slug: { type: String, index: { unique: true } },
  text: { type: String, trim: true },
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
  hide: { type: Boolean, default: false },
  commentsIndex: { type: Number, default: 0 },
  options: {}
})
schema.plugin(uniqueValidator)

// 后置钩子函数 监听 updateOne 实例方法 更新修改时间
// 可能会导致 BUG
schema.post('updateOne', async function(doc) {
  if (doc.result.nModified) {
    await this.updateMany({}, { modified: new Date() })
  }
})

schema.pre('find', function(next) {
  this.populate('categoryId')
  next()
})

schema.pre('save', function(next) {
  this.set({
    slug: this.slug || this._id
  })

  next()
})
module.exports = model('Post', schema)
