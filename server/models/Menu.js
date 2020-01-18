const { model, Schema } = require('mongoose')

const schema = new Schema({
  // Note Post Moment Home Timeline
  type: {
    type: String,
    require: true,
    unique: true
  },
  title: {
    type: String,
    require: true
  },
  order: {
    type: Number,
    default: 0
  },
  // type?: svg | other
  // content: string
  icon: {},
  options: {}
})

module.exports = model('Menu', schema)
