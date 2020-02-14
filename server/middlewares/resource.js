const assert = require('http-assert')
module.exports = (options) => {
  return (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    // try {
    // check Model
    const models = ['Post', 'Note', 'Category', 'Comment', 'Page']
    assert(
      models.includes(modelName),
      422,
      'Model not exists. ' + req.originalUrl
    )

    req.Model = require(`../models/${modelName}`)
    next()
    // } catch (e) {}
  }
}
