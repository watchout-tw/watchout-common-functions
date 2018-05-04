import io from 'socket.io-client'
import config from '../config/socket.config'

export function initSocketWithAuth(token) {
  return io(config.socketServerURL, {
    query: {
      'watchout-auth': token
    },
    transports: ['websocket']
  })
}
