const { Schema, model, SchemaTypes } = require('mongoose')

const schema = new Schema({
  author: {
    type: String,
    required: true
  },
  mail: {
    type: String
  },
  url: {
    type: String
  },
  text: {
    type: String,
    required: true
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

module.exports = model('CommentPost', schema)
