import config from '../config/config'

const channelAtPort = {
  watchout: 9000,
  park: 9487,
  ask: 9010,
  musou: 9020,
  lab: 9192,
  uc: 9210
}
const compDocURLPrefix = {
  musou: 'read',
  uc: 'read'
}
const compDocURLDefaultPrefix = 'docs'

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
  return getBaseURL(publishedTo) + (compDocURLPrefix[publishedTo] ? compDocURLPrefix[publishedTo] : compDocURLDefaultPrefix) + '/' + id
}
export function getCompVideoURL(publishedTo, id) {
  return getBaseURL(publishedTo)
}
export function getMusouProjectURL(moduleID, projectID) {
  return getBaseURL('musou') + moduleID + '/' + projectID
}
export function getWatchoutProjectURL(projectID) {
  return getBaseURL('watchout') + `projects/${projectID}`
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
        if(options.publishedTo === 'musou') {
          let [m, p] = id.split('/') // FIXME: workable but not great
          permalink = getMusouProjectURL(m, p)
        } else {
          permalink = getWatchoutProjectURL(id)
        }
      } else if(type === 'channel') {
        permalink = getBaseURL(id)
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
  if(id.indexOf(type) > -1) {
    return parseReference(id, options)
  }
  let referenceString = (type !== null && type !== undefined ? type : '') + SEPARATOR + (id !== null && id !== undefined ? (id[0] === '/' ? id.substring(1) : id) : '')
  return parseReference(referenceString, options)
}
