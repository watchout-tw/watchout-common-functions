import axios from 'axios'
import config from '../config/config'

const coralreefInstance = axios.create({
  baseURL: config.coralreefBaseURL
})

export function createLineChartSpeech(data, token, isReCAPTCHA = false) {
  const key = isReCAPTCHA ? 'reCAPTCHA' : 'Authorization'
  const headers = {[key]: token}
  const args = {
    url: '/speeches/create',
    method: 'post',
    data,
    headers
  }
  return coralreefInstance.request('/speeches/create', args)
}
