export const isMobile = () => /mobile/i.test(window.navigator.userAgent)
export const debounce = (fn, wait) => {
  let timeout = null
  return function() {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, wait)
  }
}

export default { isMobile, debounce }
