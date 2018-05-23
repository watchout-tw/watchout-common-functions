import axios from 'axios'
import config from '../config/config'

export const coreInstance = axios.create({
  baseURL: config.coreBaseURL,
  headers: {}
})

export function setAuthorizationHeader(token) {
  Object.assign(coreInstance.defaults.headers, {
    common: {
      Authorization: token
    }
  })
}

export function unsetAuthorizationHeader() {
  if(coreInstance.defaults.headers.hasOwnProperty('common') && coreInstance.defaults.headers.common.hasOwnProperty('Authorization')) {
    delete coreInstance.defaults.headers.common.Authorization
  }
}

export function isLocal() {
  return process.browser
}

export function getToken() {
  return isLocal() ? localStorage.getItem('watchout-token') : null
}

export function join(data) {
  return coreInstance.post('/auth/join', data)
}

export function login(data) {
  return coreInstance.post('/auth/login', data)
}

export function loginWithToken(token) {
  return coreInstance.post('/auth/login', {
    token
  })
}

export function requestEmailVerification(data) {
  return coreInstance.post('/citizen/emails/request_verification', data)
}

export function updatePassword(data) {
  return coreInstance.patch('/citizen/password', data)
}

export function resetPassword(data, token) {
  return coreInstance.post('/citizen/reset_password', data, {
    headers: {
      'Authorization': token
    }
  })
}

export function requrestPasswordReset(data) {
  return coreInstance.post('/citizen/request_reset_password', data)
}

export function getCitizen() {
  return coreInstance.get('/citizen')
}

export function patchCitizen(data) {
  return coreInstance.patch('/citizen', data)
}

export function getTopics() {
  return coreInstance.get('/park/topics')
}

export function pushQuestion(id) {
  if(isLocal()) {
    const token = getToken()
    if(token) {
      return coreInstance.request({
        url: `/ask/questions/${id}/push`,
        method: 'post',
        headers: {
          'Authorization': token
        }
      })
    } else {
      return Promise.reject(new Error('fe_unauthorized'))
    }
  }
}

export function reviewAnswer(id, score) {
  if(isLocal()) {
    const token = getToken()
    if(token) {
      return coreInstance.request({
        url: `/ask/answers/${id}/review`,
        method: 'post',
        headers: {
          'Authorization': token
        },
        data: {
          rate: score
        }
      })
    } else {
      return Promise.reject(new Error('fe_unauthorized'))
    }
  }
}
