import { Message } from 'element-ui'
import cookie from 'js-cookie'
export default ({ $axios, redirect }) => {
  $axios.onRequest((config) => {
    if (localStorage.token || cookie.get('token')) {
      config.headers.Authorization = localStorage.token || cookie.get('token')
    }

    return config
  })

  $axios.onResponse((res) => {
    if (res.data.ok && res.data.msg) {
      Message.success({ message: res.data.msg })
    } else if (!res.data.ok) {
      Message.error({ message: res.data.msg })
    }
    return res
  })
  $axios.onError((error) => {
    const code = parseInt(error.response?.status)

    Message({
      message: error.response?.data?.msg,
      type: 'error'
    })
    if (code === 401) {
      redirect('/login')
    }

    // prohibit go to error page when error
    return error.response
  })
}
