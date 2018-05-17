import axios from 'axios'
import config from '../config/socket.config'

export const blablablaInstance = axios.create({
  baseURL: config.blablablaBaseURL,
  headers: {}
})

export function getChatHistory(room, page = 0) {
  return blablablaInstance.get('/chat/list?room=' + room + '&page=' + page)
}
