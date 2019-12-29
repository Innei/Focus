import { User } from '~/api'
export default async ({ app, redirect, store }) => {
  const fetch = await User(app.$axios, 'checkLogged')()
  if (fetch.ok) {
    store.dispatch('master/setLogged', {
      status: Boolean(fetch.logged),
      token: process.browser ? localStorage.token : null
    })

    if (fetch.logged) {
      redirect('/admin/')
    } else {
      redirect('/admin#login')
    }
  }
}
