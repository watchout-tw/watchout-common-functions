import config from 'watchout-common-functions/config/config'

const channelAtPort = {
  watchout: 9000,
  park: 9487,
  ask: 9010,
  musou: 9020,
  lab: 9192,
  uc: 9210
}
const compDocURLPrefix = {
  musou: 'read'
}

export function getBaseURL(channelID, forceProductionURL = false) {
  let protocol = 'https://'
  let url = protocol + (channelID === 'watchout' ? 'watchout.tw/' : `${channelID}.watchout.tw/`)
  let port = channelAtPort[channelID]
  if(!forceProductionURL) {
    if(config.env === 'dev') {
      protocol = 'http://'
      url = `${protocol}dev.localhost:${port}/`
    } else if(config.env === 'beta') {
      url = protocol + (channelID === 'watchout' ? 'beta.watchout.tw/' : `beta.${channelID}.watchout.tw/`)
    }
  }
  return url
}
export function getCompDocURL(publishedTo, id) {
  return getBaseURL(publishedTo) + (compDocURLPrefix[publishedTo] ? compDocURLPrefix[publishedTo] : 'docs') + '/' + id
}
export function getCompVideoURL(publishedTo, id) {
  return getBaseURL(publishedTo)
}

const SEPARATOR = '://'

export function isValidType(type) {
  return type && typeof type === 'string' && type.match(/^[A-Za-z-]+$/)
}
export function isValidID(id) {
  return true // FIXME: any thing goes
}

export function parseReference(content, options) {
  let result = false
  if(typeof content === 'string' && content !== null && content !== undefined) {
    content = content.trim()
  }
  if(content && typeof content === 'string' && content.indexOf('\n') < 0 && content.indexOf(SEPARATOR) > -1) {
    let params = null
    if(content.indexOf('?') > -1) {
      [content, params] = content.split('?', 2)
      params = Object.assign({}, ...params.split('&').map(pair => ({ [pair.split('=', 2)[0]]: pair.split('=', 2)[1] })))
    }
    let [type, id] = content.split(SEPARATOR)

    if(isValidType(type)) {
      let permalink = null
      if(['http', 'https'].includes(type)) {
        permalink = content
      } else if(type === 'youtube') {
        permalink = 'https://www.youtube.com/watch?v=' + id
      } else if(type === 'ghost-asset') {
        permalink = 'https://beta.bunko.watchout.tw/' + id
      } else if(type === 'doc' && options && options.hasOwnProperty('publishedTo')) {
        permalink = getCompDocURL(options.publishedTo, id)
      } else if(type === 'video' && options && options.hasOwnProperty('publishedTo')) {
        permalink = getCompVideoURL(options.publishedTo, id)
      }

      if(permalink && params) {
        permalink += '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
      }
      result = {
        url: content, // type://id
        type: (type.length > 0 ? type : null),
        id: (id.length > 0 ? id : null),
        permalink,
        params
      }
    }
  }
  return result
}
export function makeReference(type, id, options) {
  let referenceString = (type !== null && type !== undefined ? type : '') + SEPARATOR + (id !== null && id !== undefined ? (id[0] === '/' ? id.substring(1) : id) : '')
  return parseReference(referenceString, options)
}
