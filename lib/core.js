import axios from 'axios'

export function getTopics() {
  return axios.get('/park/topics')
}

export function pushQuestion(id) {
  const token = process.browser ? localStorage.getItem('watchout-token') : null
  if (!token) return new Error('Not logged in')
  return axios.request({
    url: `/ask/questions/${id}/push`,
    method: 'post',
    headers: {
      'Authorization': token
    }
  })
}
