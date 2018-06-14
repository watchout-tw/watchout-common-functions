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
    delete coreInstance.defaults.headers.common
  }
}

function request(action, authIsRequired, url, payload) {
  let promise
  const token = isLocal() ? getToken() : null
  if(authIsRequired && !token) {
    promise = Promise.reject(new Error('fe_unauthorized')) // raise error if authIsRequired & token not found
  } else {
    if(token) {
      setAuthorizationHeader(token) // ignore authIsRequired & always authenticate request if token is found
    }
    if(action === 'get') {
      promise = coreInstance.get(url)
    } else if(action === 'post') {
      promise = coreInstance.post(url, payload)
    } else if(action === 'patch') {
      promise = coreInstance.patch(url, payload)
    }
    if(token) {
      unsetAuthorizationHeader()
    }
  }
  return promise
}

export function customGet(authIsRequired, url, params = null) {
  if(params) {
    url = url + '?' + qs.stringify(params)
  }
  return request('get', authIsRequired, url)
}

export function customPost(authIsRequired, url, payload = null) {
  return request('post', authIsRequired, url, payload)
}

export function customPatch(authIsRequired, url, payload = null) {
  return request('patch', authIsRequired, url, payload)
}

export function join(data) {
  return coreInstance.post('/auth/join', data)
}

export function login(data) {
  return coreInstance.post('/auth/login', data)
}

export function loginWithToken(token) {
  return coreInstance.post('/auth/login', { token })
}

export function requestPasswordReset(data) {
  return coreInstance.post('/citizen/request_reset_password', data)
}

export function resetPassword(data, token) {
  return coreInstance.post('/citizen/reset_password', data, {
    headers: {
      'Authorization': token // this is a special token for password reset
    }
  })
}

export function requestEmailVerification(data) {
  return customPost(true, '/citizen/emails/request_verification', data)
}

export function updatePassword(data) {
  return customPatch(true, '/citizen/password', data)
}

export function getCitizen() {
  return customGet(true, '/citizen')
}

export function patchCitizen(data) {
  return customPatch(true, '/citizen', data)
}

export function exploreGame(gameSlug) {
  return customGet(false, '/ask/questions', { game: gameSlug }) // TODO: replace with GET /ask/explore
}

export function getQuestions(params) {
  return customGet(false, '/ask/questions', params)
}

export function getQuestion(id) {
  return customGet(false, `/ask/questions/${id}`)
}

export function postQuestion(question) {
  return customPost(true, '/ask/questions', question)
}

export function pushQuestion(id) {
  return customPost(true, `/ask/questions/${id}/push`)
}

export function getAnswers(params) {
  return customGet(false, 'ask/answers', params)
}

export function getAnswer(id) {
  return customGet(false, `/ask/answers/${id}`)
}

export function postAnswer(answer) {
  return customPost(true, '/ask/answers', answer)
}

export function reviewAnswer(id, score) {
  return customPost(true, `/ask/answers/${id}/review`, { score })
}

// public endpoints

export function getTopics() {
  return coreInstance.get('/park/topics')
}

export function getGames() {
  return coreInstance.get('/ask/games')
}

export function getGame(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug)
}

export function getGameConfig(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/config')
}

export function getMatches(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/matches')
}

export function getMatch(gameSlug, matchSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/matches/' + matchSlug)
}

export function getParties() {
  return coreInstance.get('/c0ngress/parties')
}

// ask - game - statistics
export function getReviewCount(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/stats/review_count')
}

export function getReviewAverage(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/stats/guest_review_average')
}

export function getReviewAverageByTopic(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/stats/guest_topic_review_average')
}

export function getAnsweredAmt(gameSlug) {
  return coreInstance.get('/ask/games/' + gameSlug + '/stats/guest_answered_questions')
}
