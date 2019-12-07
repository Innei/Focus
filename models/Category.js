const { Schema, model, SchemaTypes } = require('mongoose')

const schema = new Schema({
  name: {
    required: true,
    type: String,
    index: 1
  },
  type: {
    type: String
  },
  slug: {
    type: String
  },
  count: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: new Date(),
    index: -1
  }
})

module.exports = model('Category', schema)
