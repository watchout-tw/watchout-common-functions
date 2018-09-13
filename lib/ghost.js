import axios from 'axios'
import config from 'watchout-common-functions/config/config'

let clientAuthString = `client_id=${config.ghostClient}&client_secret=${config.ghostClientSecret}`

let ghost = axios.create({
  baseURL: 'https://beta.bunko.watchout.tw/ghost/api/v0.1/'
})

export function getArticleBySlug(slug) {
  return ghost.get(`/posts/slug/${slug}?formats=mobiledoc&${clientAuthString}`)
}
