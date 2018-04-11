import axios from 'axios'
import * as localStorage from './localStorage'

export function stringifyPersonaRoles(roles) {
  return roles.map(role => role.channel + ',' + '[' + role.tags.join(',') + ']' + ',' + role.name).join('&')
}

export function stringifyPersonas(personas) {
  return JSON.stringify(personas)
}

export function deepClone(obj) {
  if(obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj) {
    return obj
  }
  let temp
  if(obj instanceof Date) {
    temp = new Date(obj)
  } else {
    temp = obj.constructor()
  }
  for(let key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null
      temp[key] = deepClone(obj[key])
      delete obj['isActiveClone']
    }
  }
  return temp
}

export function authenticateAxios() {
  const token = localStorage.token.get()
  if(token) {
    axios.defaults.headers.common['Authorization'] = token
  }
}

export function hasJWT() {
  if (!process.browser) {
    return
  }
  return localStorage.token.exist()
}
