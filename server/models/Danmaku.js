const { Schema, SchemaTypes, model } = require('mongoose')

const schema = new Schema({
  author: {
    required: true,
    type: String,
    trim: true
  },
  text: {
    trim: true,
    required: true,
    type: String
  },
  noteId: {
    type: SchemaTypes.ObjectId,
    ref: 'Note',
    required: true
  },
  created: {
    type: Date,
    default: new Date()
  },
  ip: String,
  agent: String,
  options: {}
})

module.exports = model('Danmaku', schema)
