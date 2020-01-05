import { User } from '~/api'
import cookie from 'js-cookie'
export default async ({ app, redirect, store }) => {
  const fetch = await User(app.$axios, 'checkLogged')()
  // TODO js.cookie
  if (fetch.ok) {
    store.dispatch('master/setLogged', {
      status: Boolean(fetch.logged),
      token: process.browser ? localStorage.token || cookie.get('token') : null
    })

    if (fetch.logged) {
      redirect('/admin/')
    } else {
      redirect('/admin#login')
    }
  }
}
