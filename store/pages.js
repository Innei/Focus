const state = () => ({
  pages: []
})

const actions = {
  initPages({ commit }, payload) {
    if (payload.ok) {
      const links = payload.data.map((item) => {
        return {
          to: `/pages/${item.slug}`,
          name: item.title
        }
      })
      links.unshift({
        to: '/',
        name: '首页'
      })
      commit('SET_PAGES', links)
    } else {
      commit('SET_PAGES', {
        links: [
          {
            to: '/',
            name: '首页'
          }
        ]
      })
    }
  }
}

const mutations = {
  SET_PAGES(state, pages) {
    state.pages = pages
  }
}

export default { state, actions, mutations }
