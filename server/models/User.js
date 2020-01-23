const { Schema, model } = require('mongoose')
const { hashSync } = require('bcrypt')
const schema = new Schema({
  username: { required: true, unique: true, type: String, trim: true },
  name: {
    require: true,
    type: String,
    trim: true
  },
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
  lastLoginTime: {
    type: Date
  },
  lastLoginIp: {
    type: String
  },
  authCode: {
    select: false,
    type: String,
    required: true
  },
  apiTokens: {
    type: Array,
    select: false
  }
})

module.exports = model('User', schema)
