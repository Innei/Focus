import inflection from 'inflection'
import { stringify } from 'qs'

export default ($axios, api, rest) => {
  // rest = Post | Note
  const pluralize = inflection.pluralize(rest).toLowerCase()
  const apis = {
    async getRecently(page = 1, size = 10, select) {
      const query = stringify({ page, size, select })
      const { data } = await $axios.get(`${pluralize}/?${query}`)
      return data
    },
    async getOne(id) {
      const { data } = await $axios.get(`${pluralize}/${id}`)
      return data
    },
    async postNew(body) {
      const { data } = await $axios.post(`${pluralize}`, body)
      return data
    },
    async modifyOne(id, body) {
      const { data } = await $axios.put(`${pluralize}/${id}`, body)
      return data
    },
    async deleteOne(id) {
      const { data } = await $axios.delete(`${pluralize}/${id}`)
      return data
    }
  }

  return apis[api]
}
