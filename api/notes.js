const prefix = 'notes'

export default ($axios, api) => {
  const apis = {
    async getLastest() {
      const { data } = await $axios.get(`${prefix}/lastest`)
      return data
    }
  }
  return apis[api]
}
