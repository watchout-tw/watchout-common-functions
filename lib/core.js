import axios from 'axios'
import qs from 'query-string'
import config from '../config/config'

export const coreInstance = axios.create({
  baseURL: config.coreBaseURL,
  headers: {}
})

export function isLocal() {
  return process.browser
}

export function getToken() {
  return isLocal() ? localStorage.getItem('watchout-token') : null
}

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

export function get(url, params = null) {
  if(params) {
    url = url + '?' + qs.stringify(params)
  }
  let promise = coreInstance.get(url) // TODO: replace with GET /ask/explore
  if(isLocal()) {
    const token = getToken()
    if(token) {
      setAuthorizationHeader(token)
      promise = coreInstance.get(url)
      unsetAuthorizationHeader()
    }
  }
  return promise
}

export function authenticatedPost(url, payload = null) {
  let promise = Promise.reject(new Error('fe_unauthorized')) // TODO: this raises "Unhandled promise rejection"
  if(isLocal()) {
    const token = getToken()
    if(token) {
      setAuthorizationHeader(token)
      promise = coreInstance.post(url, payload)
      unsetAuthorizationHeader()
    }
  }
  return promise
}

export function exploreGame(gameSlug) {
  return get('/ask/questions', { game: gameSlug })
}

export function getQuestions(params) {
  return get('/ask/questions', params)
}

export function getQuestion(id) {
  return get(`/ask/questions/${id}`)
}

export function postQuestion(question) {
  return authenticatedPost('/ask/questions', question)
}

export function pushQuestion(id) {
  return authenticatedPost(`/ask/questions/${id}/push`)
}

export function getAnswers(params) {
  return get('ask/answers', params)
}

export function getAnswer(id) {
  return get(`/ask/answers/${id}`)
}

export function postAnswer(answer) {
  return authenticatedPost('/ask/answers', answer)
}

export function reviewAnswer(id, score) {
  return authenticatedPost(`/ask/answers/${id}/review`, { score })
}

export function getGames() {
  return coreInstance.get('/ask/games')
}

export function getGame(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug)
}

export function getMatches(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/matches')
}

export function getMatch(gameSlug, matchSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/matches/' + matchSlug)
}
