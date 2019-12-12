const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { hashSync } = require('bcrypt')
const schema = new Schema({
  nid: { type: Number, index: -1 },
  title: { type: String, index: 1 },
  text: String,
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
    type: String,
    set(val) {
      return hashSync(val, 6)
    }
  },
  count: {
    read: {
      type: Number,
      default: 0
    },
    like: {
      type: Number,
      default: 0
    },
    comment: {
      type: Number,
      default: 0
    }
  }
})
schema.plugin(uniqueValidator)
module.exports = model('Note', schema)
