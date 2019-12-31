export default ($axios, api) => {
  const apis = {
    async comment(pid, body) {
      const { data } = await $axios.post(`comments/${pid}`, body)
      return data
    }
  }

  return apis[api]
}
