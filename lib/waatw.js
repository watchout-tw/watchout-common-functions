import axios from 'axios'
import config from 'watchout-common-functions/config/config'

export const waatwInstance = axios.create({
  baseURL: config.waaBaseURL,
  headers: {}
})

export function createShortenLink(url) {
  const args = {
    method: 'post',
    url: '/create',
    data: {
      url
    }
  }
  return waatwInstance.request(args)
}
