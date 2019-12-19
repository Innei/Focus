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

export const parseDate = (date) => {
  const d = new Date(date)
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    m: d.getMinutes(),
    h: d.getHours(),
    s: d.getSeconds()
  }
}

export default { isMobile, debounce }
