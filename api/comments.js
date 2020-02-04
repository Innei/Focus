const url = `comments`
export default ($axios, api) => {
  const apis = {
    async getList(pid) {
      const { data } = await $axios.get(`${url}/post/${pid}`)
      return data
    }
  }

  return apis[api]
}
