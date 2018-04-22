import axios from 'axios'

/*
if(process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://core.watchout.tw'
} else if(process.env.NODE_ENV === 'staging') {
  axios.defaults.baseURL = 'https://staging.core.watchout.tw'
} else {
  axios.defaults.baseURL = 'https://dev.core.watchout.tw'
}
*/

axios.defaults.baseURL = 'https://dev.core.watchout.tw'

export function join(data) {
  return axios.post('/auth/join', data)
}

export function login(data) {
  return axios.post('/auth/login', data)
}

export function requestEmailVerification(data) {
  console.log('requestEmailVerification', data)
}

export function updatePassword(data) {
  return axios.patch(`/citizen/password`, data)
}

export function requrestPasswordReset(data) {
  console.log('requrestPasswordReset', data)
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
