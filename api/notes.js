const prefix = 'notes'

export default ($axios, api) => {
  const apis = {
    async getLastest() {
      const { data } = await $axios.get(`${prefix}/lastest`)
      return data
    },
    async getList(id) {
      const { data } = await $axios.get(`${prefix}/list/${id}`)
      return data
    }
  }
  return apis[api]
}
