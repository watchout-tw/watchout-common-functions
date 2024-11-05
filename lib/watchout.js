import config from '../config/config'

// const channelAtPort = {
//   watchout: 9000,
//   park: 9487,
//   ask: 9010,
//   musou: 9020,
//   lab: 9192,
//   uc: 9210
// }
// const compDocURLPrefix = {
//   musou: 'read',
//   uc: 'read'
// }
// const compDocURLDefaultPrefix = 'docs'

export function getBaseURL(forceProductionURL = false) {
  let url = 'https://watchout.tw/'
  if(!forceProductionURL) {
    if(config.env === 'dev') {
      url = 'https://localhost:9000/'
    } else if(config.env === 'beta') {
      url = 'https://beta.watchout.tw/'
    }
  }
  return url
}
export function getCompDocURL(publishedTo, id) {
  const baseURL = getBaseURL()
  switch(publishedTo) {
    case 'musou':
      return baseURL + 'reports/' + id
    case 'uc':
      return baseURL + 'forum/' + id
    case 'project':
      return baseURL + 'projects/' + id
    default:
      return baseURL + 'reports/' + id
  }
}

// TODO: video url is not complete
export function getCompVideoURL(id) {
  return getBaseURL()
}

export function getWatchoutProjectURL(projectID, translation = null) {
  return getBaseURL() + (translation ? `${translation}/` : '') + `projects/${projectID}`
}

const SEPARATOR = '://'

export function isValidType(type) {
  return type && typeof type === 'string' && type.match(/^[A-Za-z-]+$/)
}
export function isValidID(id) {
  return true // FIXME: any thing goes
}

export const WATCHOUT_REF_TYPES = ['doc', 'project']

export function parseReference(content, options = {}) {
  let result = false
  if(typeof content === 'string' && content !== null && content !== undefined) {
    content = content.trim()
  }
  if(content && typeof content === 'string' && !content.includes('\n') && content.includes(SEPARATOR)) {
    let params = null
    if(content.includes('?')) {
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
        let separator = config.ghostBaseURL.slice(-1) !== '/' && id.charAt(0) !== '/' ? '/' : ''
        permalink = config.ghostBaseURL + separator + id
      } else if(type === 'doc' && options.publishedTo) {
        permalink = getCompDocURL(options.publishedTo, id)
      } else if(type === 'video' && options.publishedTo) {
        permalink = getCompVideoURL(options.publishedTo, id)
      } else if(type === 'project') {
        permalink = getWatchoutProjectURL(id)
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
  if(id.includes(type)) {
    return parseReference(id, options)
  }
  let referenceString = (type !== null && type !== undefined ? type : '') + SEPARATOR + (id !== null && id !== undefined ? (id[0] === '/' ? id.substring(1) : id) : '')
  return parseReference(referenceString, options)
}
