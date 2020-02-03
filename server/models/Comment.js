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
  hasParent: {
    type: Boolean,
    default: false
  },
  children: {
    type: [SchemaTypes.ObjectId],
    ref: 'Comment'
  },
  commentsIndex: {
    type: Number,
    default: 0
  },
  key: {
    type: String
  },
  ip: String,
  agent: String
})

function autoPopulateSubs(next) {
  this.populate('children')
  next()
}

schema.pre('findOne', autoPopulateSubs).pre('find', autoPopulateSubs)

module.exports = model('Comment', schema)
