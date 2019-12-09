import jsCookies from 'js-cookie'
const cookieName = 'watchout_fs_uid' // FIXME: watchout_fs_token

function getCookieDomain() {
  let currentURL = window.location.hostname
  return (currentURL.includes('localhost')) ? 'dev.localhost' : 'watchout.tw'
}

export function set(val) {
  if(process.client) {
    jsCookies.set(cookieName, val, { expires: 7, domain: getCookieDomain(), path: '/' })
  }
}

export function remove() {
  if(process.client) {
    jsCookies.remove(cookieName, { domain: getCookieDomain(), path: '/' })
  }
}
