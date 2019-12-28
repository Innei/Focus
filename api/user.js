export default ($axios, api) => {
  const apis = {
    async getUserProfile(id) {
      const { data } = await $axios.get(`master/${id}`)
      return data
    },
    async createNewUser(body) {
      const { username, password, mail = '', url = '' } = body
      if (!username && !password) {
        throw new Error('用户名或密码为空')
      }
      const { data } = await $axios.post('master/sign_up', {
        username,
        password,
        url,
        mail
      })
      return data
    },
    async signOutAll() {
      const { data } = await $axios.get('master/sign_out')
      return data
    },
    async checkLogged() {
      if (!localStorage.token) {
        return { ok: 1, logged: 0 }
      }
      const { data } = await $axios.get('master/check_logged')
      return data
    },
    async updateConfig(body) {
      const { data } = await $axios.put('config/init', body)
      return data
    }
  }
  return apis[api]
}
