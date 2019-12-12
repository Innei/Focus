const { model, Schema } = require('mongoose')

const schema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  value: {
    type: Schema.Types.Mixed
  }
})

module.exports = model('Option', schema)
