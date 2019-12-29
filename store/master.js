const state = () => ({
  token: null,
  isLogged: false
})

const actions = {
  setLogged({ commit }, { status = true, token }) {
    commit('SET_STATUS', status)

    commit('SET_TOKEN', token)
  }
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_STATUS(state, status) {
    state.isLogged = status
  }
}

export default {
  state,
  actions,
  mutations
}
