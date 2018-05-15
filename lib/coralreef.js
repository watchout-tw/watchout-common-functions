import axios from 'axios'
import config from '../config/config'

export const coralreefInstance = axios.create({
  baseURL: config.coralreefBaseURL,
  headers: {}
})

export function createSpeech(data, token, isReCAPTCHA = false) {
  const key = isReCAPTCHA ? 'Recaptcha' : 'Authorization'
  const args = {
    method: 'post',
    url: '/speeches/create',
    headers: { [key]: token },
    data
  }
  return coralreefInstance.request(args)
}
