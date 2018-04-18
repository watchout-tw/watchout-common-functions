import axios from 'axios'

export function getTopics() {
  return axios.get('/park/topics')
}
