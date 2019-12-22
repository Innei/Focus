export const state = () => ({
  config: {}
})

export const actions = {
  init({ commit }, config) {
    commit('SET_CONFIG', config)
  }
}

export const mutations = {
  SET_CONFIG(state, config) {
    state.config = config
  }
}

export default { state, actions, mutations }
