const { model, Schema } = require('mongoose')

const schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    index: 1
  },
  value: {
    type: Schema.Types.Mixed
  }
})

module.exports = model('Option', schema)
