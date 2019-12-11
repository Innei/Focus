export default ($axios, api) => {
  const apis = {
    async getUserProfile(id) {
      const { data } = $axios.get(`user/${id}`)
      return data
    },
    async createNewUser(body) {
      const { username, password, mail = '', url = '' } = body
      if (!username && !password) {
        throw new Error('用户名或密码为空')
      }
      const { data } = $axios.post('user/signup', {
        username,
        password,
        url,
        mail
      })
      return data
    },
    async signOutAll() {
      const { data } = await $axios.get('user/sign_out', { id })
      return data
    },
    async checkLogged() {
      if (!localStorage.token) {
        return { ok: 1, logged: 0 }
      }
      const { data } = await $axios.get('user/check_logged')
      return data
    }
  }
  return apis[api]
}
