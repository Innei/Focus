export const state = () => ({
  config: {},
  menus: []
})

export const actions = {
  init({ commit }, [config, menus]) {
    commit('SET_CONFIG', config)
    commit('SET_MENUS', menus)
  }
}

export const mutations = {
  SET_CONFIG(state, config) {
    state.config = config
  },
  SET_MENUS(state, menus) {
    state.menus = menus
  }
}

export default { state, actions, mutations }
