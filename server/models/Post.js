const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const schema = new Schema({
  title: { type: String, index: 1 },
  slug: { type: String, index: { unique: true }, required: true },
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
  status: { type: String, default: 'Published' },
  commentsNum: { type: Number, default: 0 },
  type: { type: String, default: 'post' }
})
schema.plugin(uniqueValidator)
module.exports = model('Post', schema)
