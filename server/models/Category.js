const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const schema = new Schema({
  name: {
    required: true,
    type: String,
    index: {
      unique: true
    }
  },
  type: {
    type: String,
    default: 'Category'
  },
  slug: {
    type: String,
    index: { unique: true },
    required: true
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
schema.plugin(uniqueValidator)
module.exports = model('Category', schema)
