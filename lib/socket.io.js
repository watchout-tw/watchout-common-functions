import io from 'socket.io-client'
import config from '../config/socket.config'

const token = '' // TODO: need to get token
const socket = io(config.socketServerURL, {
  query: {
    'watchout-auth': token
  },
  transports: ['websocket']
})

export default socket
