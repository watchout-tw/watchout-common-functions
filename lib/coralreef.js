import axios from 'axios'
import config from '../config/config'

export const coralreefInstance = axios.create({
  baseURL: config.coralreefBaseURL
})

export function createSpeech(data, token, isReCAPTCHA = false) {
  const key = isReCAPTCHA ? 'Recaptcha' : 'Authorization'
  const args = {
    headers: {[key]: token},
    url: '/speeches/create',
    method: 'post',
    data
  }
  return coralreefInstance.request(args)
}
