const { Schema, model, SchemaTypes } = require('mongoose')

const schema = new Schema({
  pid: {
    type: SchemaTypes.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  mail: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  state: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: new Date()
  },
  parentId: {
    type: SchemaTypes.ObjectId,
    ref: 'CommentPost'
  },
  key: {
    type: String
  },
  ip: String,
  agent: String
})

module.exports = model('Comment', schema)
