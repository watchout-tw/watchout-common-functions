import axios from 'axios'

export function makeCitizenRoleString(roles) {
  return roles.map(role => role.channel + '.' + role.name).join(',')
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

export function authenticateAxios () {
  const token = localStorage.getItem('watchout-token')
  if(token) {
    axios.defaults.headers.common['Authorization'] = token
  }
}

export function hasJWTToken () {
  if (!process.browser) return
  return !!localStorage.getItem('watchout-token')
}
