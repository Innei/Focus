export default ($axios, api) => {
  const apis = {
    async getWithSlug(category, slug) {
      if (/.html$/.test(slug)) {
        slug = slug.replace(/.html$/, '')
      }
      const { data } = await $axios.get(encodeURI(`posts/${category}/${slug}`))
      return data
    }
  }

  return apis[api]
}
