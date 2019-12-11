export default ({ $axios, redirect }) => {
  $axios.onRequest((config) => {
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    console.log('Making request to ' + config.url)
    return config
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      redirect('/401')
    }
  })
}
