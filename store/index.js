export const getters = {
  viewport: (state) => state.viewport.viewport,
  navActive: (state) => state.Navigation.active,
  config: (state) => state.config.config,
  isLogged: (state) => state.master.isLogged,
  token: (state) => state.master.token
}

export const strict = false
