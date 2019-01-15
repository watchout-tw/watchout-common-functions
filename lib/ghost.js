import axios from 'axios'
import config from 'watchout-common-functions/config/config'

let clientAuthString = `client_id=${config.ghostClient}&client_secret=${config.ghostClientSecret}`

let ghost = axios.create({
  baseURL: 'https://beta.bunko.watchout.tw/ghost/api/v0.1/'
})

const defaultInclude = ['authors']

export function getArticles(include = defaultInclude) {
  return ghost.get(`/posts?formats=mobiledoc&include=${include.join(',')}&${clientAuthString}`)
}

export function getArticle(id, include = defaultInclude) {
  return ghost.get(`/posts/${id}?formats=mobiledoc&include=${include.join(',')}&${clientAuthString}`)
}

export function getArticleBySlug(slug) {
  return ghost.get(`/posts/slug/${slug}?formats=mobiledoc&${clientAuthString}`)
}

export function getAuthors() {
  return ghost.get(`/users?${clientAuthString}`)
}
