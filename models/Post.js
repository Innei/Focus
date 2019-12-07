const { Schema, model, SchemaTypes } = require('mongoose')

const schema = new Schema({
  title: { type: String, index: 1 },
  slug: { type: String },
  categoryId: {
    type: SchemaTypes.ObjectId,
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
    type: SchemaTypes.ObjectId,
    ref: 'User'
  },
  status: String,
  commentsNum: { type: Number, default: 0 }
})

schema.path('title').validate((val) => {
  return !!val
}, '标题不能为空')

module.exports = model('Post', schema)
