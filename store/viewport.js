export const state = () => ({
  viewport: null
})

export const actions = {
  updateViewport({ state }) {
    state.viewport = {
      w: document.documentElement.getBoundingClientRect().width,
      h: window.innerHeight,
      mobile: window.screen.width <= 568,
      laptop: window.innerWidth <= 768,
      desktop: window.innerWidth <= 1024
    }
  }
}

export default { state, actions }
