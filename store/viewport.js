export const state = () => ({
  viewport: null
})

export const actions = {
  updateViewport({ state }) {
    state.viewport = {
      w: window.innerWidth,
      h: window.innerHeight,
      mobile: window.innerWidth <= 568,
      laptop: window.innerWidth <= 768,
      desktop: window.innerWidth <= 1024
    }
  }
}

export default { state, actions }
