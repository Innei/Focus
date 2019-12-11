const { Schema, model } = require('mongoose')
const { hashSync } = require('bcrypt')
const schema = new Schema({
  username: { required: true, unique: true, type: String },
  password: {
    type: String,
    set(val) {
      return hashSync(val, 6)
    },
    select: false
  },
  mail: String,
  url: String,
  created: {
    type: Date,
    default: new Date()
  },
  logged: {
    type: Date
  },
  authCode: {
    select: false,
    type: String,
    required: true
  },
  apiTokens: Array
})

module.exports = model('User', schema)
