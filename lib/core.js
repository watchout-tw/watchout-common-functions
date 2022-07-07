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
  if(
    coreInstance.defaults.headers.hasOwnProperty('common') &&
        coreInstance.defaults.headers.common.hasOwnProperty('Authorization')
  ) {
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

export function loginWithTokenWithPersonaID(token, personaID) {
  return coreInstance.post('/auth/login', { token, persona_id: personaID })
}

export function requestPasswordReset(data) {
  return coreInstance.post('/citizen/request_reset_password', data)
}

export function resetPassword(data, token) {
  return coreInstance.post('/citizen/reset_password', data, {
    headers: {
      Authorization: token // this is a special token for password reset
    }
  })
}

export function requestEmailVerification(data) {
  return customPost(false, '/citizen/emails/request_verification', data)
}

export function confirmEmailVerification(id, token) {
  return customGet(
    false,
    `/citizen/emails/${id}/confirm_verification/${token}`
  )
}

export function updatePassword(data) {
  return customPatch(true, '/citizen/password', data)
}

export function getEmails() {
  return customGet(true, '/citizen/emails')
}

export function getCitizen() {
  return customGet(true, '/citizen')
}

export function getCitizenByID(id) {
  return customGet(true, `/citizen/${id}`)
}

export function getCitizens(params) {
  return customGet(true, '/citizens', params)
}

export function patchCitizen(data) {
  return customPatch(true, '/citizen', data)
}

export function patchPersona(data) {
  return customPatch(true, '/persona', data)
}

export function getPersona(id) {
  return customGet(false, `/personas/${id}`)
}

export function getPersonaSummary(id) {
  return customGet(false, `/personas/${id}/summary`)
}

export function getAuthors() {
  return customGet(false, '/personas/author')
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
  return coreInstance.get(
    '/ask/games/' + gameSlug + '/stats/guest_review_average'
  )
}

export function getReviewAverageByTopic(gameSlug) {
  return coreInstance.get(
    '/ask/games/' + gameSlug + '/stats/guest_topic_review_average'
  )
}

export function getAnsweredAmt(gameSlug) {
  return coreInstance.get(
    '/ask/games/' + gameSlug + '/stats/guest_answered_questions'
  )
}

export function getReps() {
  return coreInstance.get('/c0ngress/reps')
}

export function getCaucuses() {
  return coreInstance.get('/c0ngress/caucuses')
}

export function getGovAgencies() {
  return coreInstance.get('/c0ngress/gov_agencies')
}

export function getLegislativeSteps() {
  return coreInstance.get('/c0ngress/legislative_steps')
}

export function getTopicOverviews() {
  return coreInstance.get('/lab/topic_overviews')
}

export function getTopicOverview(id) {
  return coreInstance.get(`/lab/topic_overviews/${id}`)
}

export function getDataReports() {
  return coreInstance.get('/lab/data_reports')
}

export function getDataReport(id) {
  return coreInstance.get(`/lab/data_reports/${id}`)
}

export function getRepsByParams(termIdx, partyID = null) {
  const params = {
    term: termIdx,
    party: partyID
  }
  return coreInstance.get('/c0ngress/reps', { params })
}

export function getRepInfo(date, repIDs) {
  const timestamp = new Date(date).getTime()
  const params = `date=${timestamp}&reps=[${repIDs}]`
  return coreInstance.get(`/c0ngress/date_to_rep_info?${params}`)
}

export function getInlineHtml(url) {
  return coreInstance.post('/toolkit/html', url, { responseType: 'blob' })
}

// Member / Stores

export function getMerchandise() {
  return coreInstance.get('/store/merchandises')
}

export function getPhysicalProducts() {
  const params = {
    type: 'physical-product'
  }
  return coreInstance.get('/store/merchandises', { params })
}

export function getMemberPlans() {
  const params = {
    type: 'plan'
  }
  return coreInstance.get('/store/merchandises', { params })
}

export function getMerchant(id) {
  return coreInstance.get(`/store/merchandises/${id}`)
}

export function patchMerchant(id, merchant) {
  return coreInstance.patch(`/store/merchandises/${id}`, merchant)
}

export function postMerchant(merchant) {
  return coreInstance.post('/store/merchandises', merchant)
}

export function getSuccessOrders() {
  const params = {
    payment: 'success'
  }
  return customGet(true, '/store/orders/csv', params)
}

// alps banner

export function getBanners() {
  return coreInstance.get('/console/comp/banners')
}

export function getBanner(id) {
  return coreInstance.get(`/console/comp/banners/${id}`)
}

export function createBanner(params) {
  return coreInstance.post('/console/comp/banners', params)
}

export function updateBanner(params) {
  return coreInstance.patch(`/console/comp/banners/${params.id}`, params)
}

export function updateBanners(params) {
  return coreInstance.patch('/console/comp/banners', params)
}

export function deleteBanner(id) {
  return coreInstance.delete(`/console/comp/banners/${id}`)
}

// alps timeline

export function getTimelines() {
  return coreInstance.get('/comp/timelines')
}

export function getTimeline(id) {
  return coreInstance.get(`/comp/timelines/${id}`)
}

export function postTimeline(params) {
  return coreInstance.post('/comp/timelines', params)
}

export function patchTimeline(params) {
  return coreInstance.patch(`/comp/timelines/${params.id}`, params)
}

export function deleteTimeline(id) {
  return coreInstance.delete(`/comp/timelines/${id}`)
}

// alps timeline event

export function getTimelineEvents(timelineID) {
  return coreInstance.get(`/comp/timelines/${timelineID}/events`)
}

export function getTimelineEvent(timelineID, eventID) {
  return coreInstance.get(`/comp/timelines/${timelineID}/events/${eventID}`)
}

export function postTimelineEvent(timelineID, params) {
  return coreInstance.post(`/comp/timelines/${timelineID}/events`, params)
}

export function patchTimelineEvent(timelineID, params) {
  return coreInstance.patch(
    `/comp/timelines/${timelineID}/events/${params.id}`,
    params
  )
}

export function deleteTimelineEvent(timelineID, eventID) {
  return coreInstance.delete(`/comp/timelines/${timelineID}/events/${eventID}`)
}

// alps tags

export function getTags() {
  return coreInstance.get('/comp/tags')
}

export function getTag(id) {
  return coreInstance.get(`/comp/tags/${id}`)
}

export function getTagBySlug(slug) {
  return coreInstance.get(`/comp/tags/${slug}?type=slug`)
}

export function postTag(params) {
  return coreInstance.post('/comp/tags', params)
}

export function patchTag(params) {
  return coreInstance.patch(`/comp/tags/${params.id}`, params)
}

export function deleteTag(id) {
  return coreInstance.delete(`/comp/tags/${id}`)
}

// verify API

export function carruerVerify(number) {
  return coreInstance.post('/store/carruer/verification', { carruerNum: number })
}

export function loveCodeVerify(number) {
  return coreInstance.post('/store/lovecode/verification', { loveCode: number })
}
