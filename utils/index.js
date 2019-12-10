const utils = {
  isMobile: () => /mobile/i.test(window.navigator.userAgent),
  debounce: (fn, wait) => {
    let timeout = null
    return function() {
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(fn, wait)
    }
  }
}

export default utils
