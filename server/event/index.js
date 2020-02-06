import E from './types'
import C, { createPost } from '~/controller'
module.exports = (app) => {
  app.on(E.CREATE_POST, createPost(app))
}
