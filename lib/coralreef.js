import axios from 'axios'
import config from '../config/config'

const coralreefInstance = axios.create({
  baseURL: config.coralreefBaseURL
})

export function createLineChartSpeech(data, token) {
  const headers = {
    Authorization: token
  }
  console.info(token)
  const args = {
    url: '/speeches/create',
    method: 'post',
    data,
    headers
  }
  return coralreefInstance.request('/speeches/create', args)
}
