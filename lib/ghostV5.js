import axios from 'axios'
import config from 'watchout-common-functions/config/config'

let ghost = axios.create({
  // baseURL: `${config.ghostV5ApiURL}/${config.env === 'production' ? 'production' : 'development'}`,
  baseURL: config.ghostV5ApiURL,
  timeout: 60000,
  headers: { 'Authorization': config.ghostV5AdminKey }
})

const defaultInclude = ['authors']

export function getArticles(page = 1, include = defaultInclude) {
  const params = {
    limit: 100,
    page,
    order: 'updated_at desc',
    include: include.join(','),
    key: config.ghostV5ContentKey
  }
  return ghost.get(`/content/posts`, { params })
}

export function getArticle(id, include = defaultInclude) {
  const params = {
    include: include.join(','),
    key: config.ghostV5contentKey
  }
  return ghost.get(`/content/posts/${id}`, { params })
}

// export function getArticleBySlug(slug) {
//   return ghost.get(`/posts/slug/${slug}`)
// }

// export function getAuthors() {
//   return ghost.get('/authors')
// }
