import axios from 'axios'
import config from '../config/config'

axios.defaults.baseURL = config.coreBaseURL

export function join(data) {
  return axios.post('/auth/join', data)
}

export function login(data) {
  return axios.post('/auth/login', data)
}

export function requestEmailVerification(data) {
  return axios.post('/citizen/emails/request_verification', data)
}

export function updatePassword(data) {
  return axios.patch('/citizen/password', data)
}

export function resetPassword(data, token) {
  return axios.post('/citizen/reset_password', data, {
    headers: {
      'Authorization': token
    }
  })
}

export function requrestPasswordReset(data) {
  return axios.post('/citizen/request_reset_password', data)
}

export function getCitizen() {
  return axios.get('/citizen')
}

export function patchCitizen(data) {
  return axios.patch('/citizen', data)
}

export function getTopics() {
  return axios.get('/park/topics')
}

export function pushQuestion(id) {
  const token = process.browser ? localStorage.getItem('watchout-token') : null
  if(token) {
    return axios.request({
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

export function reviewAnswer(id) {
  const token = process.browser ? localStorage.getItem('watchout-token') : null
  if (!token) return Promise.reject(new Error('fe_unauthorized'))
  return axios.request({
    url: `/ask/answers/${id}/review`,
    method: 'post',
    headers: {
      'Authorization': token
    }
  })
}
