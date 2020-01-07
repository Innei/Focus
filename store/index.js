export const getters = {
  viewport: (state) => state.viewport.viewport,
  navActive: (state) => state.Navigation.active,
  config: (state) => state.config.config,
  isLogged: (state) => state.master.isLogged,
  token: (state) => state.master.token,
  pages: (state) => state.pages.pages
}

export const strict = false
