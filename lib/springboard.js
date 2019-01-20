import axios from 'axios'
import config from 'watchout-common-functions/config/config'

export const springboardInstance = axios.create({
  baseURL: config.springboardURL,
  headers: {}
})

export async function get(url) {
  let result = await springboardInstance.get('/get.php?url=' + url)
  return result.data
}
export async function getMeta(url) {
  let result = await springboardInstance.get('/get-meta.php?url=' + url)
  return result.data
}
