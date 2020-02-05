export const state = () => ({
  scroll: 'down'
})

export const actions = {
  updateScroll({ commit }, direction) {
    if (['down', 'up'].includes(direction)) {
      commit('SET_SCROLL_DIRECTION', direction)
    } else {
      throw new Error('set scroll direction value error')
    }
  }
}

export const mutations = {
  SET_SCROLL_DIRECTION(state, direction) {
    state.scroll = direction
  }
}

export default { state, actions, mutations }
