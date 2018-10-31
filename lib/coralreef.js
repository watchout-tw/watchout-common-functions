import axios from 'axios'
import config from 'watchout-common-functions/config/config'

export const coralReefInstance = axios.create({
  baseURL: config.coralreefBaseURL,
  headers: {}
})

export function createSpeech(data, token, tokenSource) {
  const key = tokenSource === 'recaptcha' ? 'Recaptcha' : 'Authorization'
  const args = {
    method: 'post',
    url: '/speeches/create',
    headers: { [key]: token },
    data
  }
  return coralReefInstance.request(args)
}
