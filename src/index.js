const cookies = document.cookie

const getBegin= prefix => {
  const isFirstKey = cookies.indexOf(prefix)
  if (isFirstKey !== 0) {
    return isFirstKey +prefix.length
  }

  const isMiddleKey = cookies.indexOf(`; ${prefix}`)
  if (isMiddleKey >= 0) {
    return isMiddleKey +2 +prefix.length
  }

  return null
}

const getEnd = prefix => {
  const endCookie = cookies.indexOf(';', beginCookie)
  if (endCookie === -1) {
    return cookies.length

  } else {
    return endCookie
  }
}

const getPos = name => {
  const prefix = `${name}=`
  const begin = getBegin(prefix)
  if (begin === null) {
    return null
  }

  const end = getEnd(begin)
  return { begin, end }
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
