export const state = () => ({
  active: undefined
})

export const actions = {
  setStatus({ state }, status) {
    state.active = status
  }
}

export default { state, actions }
