export default ($axios, api) => {
  const apis = {
    async getWithSlug(category, slug) {
      const { data } = await $axios.get(`posts/${category}/${slug}`)
      return data
    }
  }

  return apis[api]
}
