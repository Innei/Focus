const state = () => ({
  posts: {},
  notes: {}
})

const actions = {
  updateNews({ commit }, { data, type }) {
    if (Array.isArray(data) && ['Post', 'Note'].includes(type)) {
      commit(
        `SET_${type.toUpperCase()}S`,
        Object.assign({}, { updateAt: new Date(), data })
      )
    }
  }
}

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  SET_NOTES(state, notes) {
    state.notes = notes
  }
}

export default {
  state,
  actions,
  mutations
}
