export const state = () => ({
  viewport: null
})

export const actions = {
  updateViewport({ state }) {
    state.viewport = {
      w: document.documentElement.getBoundingClientRect().width,
      h: window.innerHeight,
      mobile: window.screen.width <= 568 || window.innerWidth <= 568,
      pad: window.innerWidth <= 768 && window.innerWidth > 568,
      hpad: window.innerWidth <= 1024 && window.innerWidth > 768,
      wider: window.innerWidth >= 1440 && window.innerWidth < 1920,
      widest: window.innerWidth >= 1920
    }
  }
}

export default { state, actions }
