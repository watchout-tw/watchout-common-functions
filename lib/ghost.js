import axios from 'axios'
import config from 'watchout-common-functions/config/config'

let ghost = axios.create({
  baseURL: `${config.ghostApiURL}/${config.env === 'production' ? 'production' : 'development'}`,
  timeout: 60000,
  headers: { 'Authorization': config.ghostToken }
})

const defaultInclude = ['authors']

export function getArticles(page = 1, include = defaultInclude) {
  const params = {
    page: page,
    order: 'updated_at desc',
    include: include.join(',')
  }
  return ghost.get('/posts', { params })
}

export function getArticle(id, include = defaultInclude) {
  const params = {
    include: include.join(',')
  }
  return ghost.get(`/posts/${id}`, { params })
}

export function getArticleBySlug(slug) {
  return ghost.get(`/posts/slug/${slug}`)
}

export function getAuthors() {
  return ghost.get('/authors')
}
