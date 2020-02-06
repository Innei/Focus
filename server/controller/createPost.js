import E from '~/event/types'
const { Post } = require('~/models')
const Sync = require('~/helpers/sync')
export default (app) => async () => {
  if (process.env.GIST_TOKEN && process.env.GIST_POST_ID) {
    const gists = new Sync(process.env.GIST_TOKEN, process.env.GIST_POST_ID)
    const posts = await Post.find()
      .select('-_id -__v -commentIndex -hide -summary')
      .populate('categoryId', 'name')
    app.emit(E.MESSAGE_SEND, {
      type: 'success',
      message: posts
    })
    // const syncRes = await gists.patchGist(posts, 'posts')
    // try {
    //   if (syncRes.ok) {
    //     req.app.get('ws').send(
    //       JSON.stringify({
    //         type: 'success',
    //         msg: syncRes.msg
    //       })
    //     )
    //   } else {
    //     req.app.get('ws').send(
    //       JSON.stringify({
    //         type: 'error',
    //         msg: `[${syncRes.code}] ${syncRes.msg}`
    //       })
    //     )
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
    console.log(posts, app)
  }
}
