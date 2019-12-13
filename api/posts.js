// export default ($axios, api) => {
//   const apis = {
//     async getRecently(page = 1, size = 10) {
//       const { data } = await $axios.get(`posts/?page=${page}&size=${size}`)
//       return data
//     },
//     async getOne(id) {
//       const { data } = await $axios.get(`posts/${id}`)
//       return data
//     },
//     async postNew(body) {
//       const { data } = $axios.post(`posts`, body)
//       return data
//     },
//     async modifyOne(id, body) {
//       const { data } = $axios.put(`posts/${id}`, body)
//       return data
//     },
//     async deleteOne(id) {
//       const { data } = $axios.delete(`posts/${id}`)
//       return data
//     }
//   }

//   return apis[api]
// }
