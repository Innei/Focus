const { Schema, model } = require('mongoose')

const schema = new Schema({
  title: { type: String, index: 1 },
  slug: { type: String, index: 1 },
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
  text: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: { type: String, default: 'Published' },
  commentsNum: { type: Number, default: 0 },
  type: { type: String, default: 'post' }
})

schema.path('title').validate((val) => {
  return !!val
}, '标题不能为空')

module.exports = model('Post', schema)
