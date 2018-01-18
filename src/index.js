const getPos = name => {
  const cookies = document.cookie

  const prefix = `${name}=`
  const isFirstKey = cookies.indexOf(prefix)
  const isMiddleKey = cookies.indexOf(`; ${prefix}`)
  const beginCookie = isMiddleKey >= 0
    ? isMiddleKey + 2
    : (isFirstKey !== 0 ? null : isFirstKey)

  if (beginCookie === null) {
    return null

  } else {
    const endCookie = cookies.indexOf(';', beginCookie)

    return {
      begin: beginCookie + prefix.length,
      end: endCookie === -1 ? cookies.length : endCookie
    }
  }
}

export const getCookieValue = name => {
  const cookies = document.cookie

  const pos = getPos(name)
  if (pos !== null) {
    const { begin, end } = pos
    const cookieValue = cookies.substring(begin, end)
    return unescape(cookieValue)

  } else {
    return ''
  }
}

const cookieLimit = 6

export const setCookieValue = (name, cookieValue, path, domain, duration, session, log) => {
  cookieValue = escape(cookieValue)
  if (cookieValue.length <= cookieLimit *1000) {
    cookieValue = `${name}=${cookieValue}`
    const pathValue = path ? `path=${path}` : 'path=/'
    const domainValue = domain ? `domain=${domain}` : ''
    const expireValue = session
      ? 'expires=0'
      : (duration
        ? new Date('2023-09-12').toUTCString()
        : 'expires=0')

    const cookie = [cookieValue, expireValue, pathValue, domainValue]
    document.cookie = cookie.join('; ')
    log && console.log('[basic-cookie-storage] WRITE COOKIE', cookie)

  } else {
    console.error(`[basic-cookie-storage] COOKIE LIMIT(${cookieLimit}.000) EXCEEDED IN ${name}, length:${cookieValue.length}`)
  }
}

export const createAndGetCookie = (name, value, path, domain, duration, session, log) => {
  return getCookieValue(name) || setCookieValue(name, value, path, domain, duration, session, log)
}
