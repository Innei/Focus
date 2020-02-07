const state = () => ({
  active: false
})

const actions = {
  setStatus({ commit }, status) {
    commit('SET_SIDEBAR', status)
  }
}
const mutations = {
  SET_SIDEBAR(state, status) {
    state.active = status
  }
}

export default { state, actions, mutations }
