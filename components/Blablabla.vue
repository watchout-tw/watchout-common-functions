<template>
<div class="blablabla">
  <div class="messages font-size-small">
    <div class="not-available text-align-center" v-if="messages.length < 1">暫時沒有訊息</div>
    <div class="message" v-for="message in messages" :key="message._id">
      <div class="content">
        <span class="speaker">{{ message.alias }}</span><span class="text">{{ message.content }}</span>
      </div>
      <like-buttons :config="likeButtonsConfig" :state="getMessageState(message)" @like="onLike(message)"  @dislike="onDislike(message)">
        <template slot="like-count">{{ message.detail && message.detail.like ? message.detail.like.length : 0 }}</template>
        <template slot="dislike-count">{{ message.detail && message.detail.dislike ? message.detail.dislike.length : 0 }}</template>
      </like-buttons>
    </div>
  </div>
  <div class="log" v-if="showlogHistory">
    <div v-for="(entry, index) of logHistory" :key="index">{{ entry }}</div>
  </div>
  <form class="send-message" @submit.prevent="onSubmit">
    <div class="field with-button">
      <text-editor placeholder="輸入訊息" v-model="newMessage" :classes="['park']" :simple="true" :maxlength="messageLengthLimit" key="newMessage" />
      <button type="submit" class="button small park">送出</button>
    </div>
  </form>
</div>
</template>

<script>
import * as blablabla from '../lib/blablabla'
import * as SOCKETIO from '../lib/socket.io.js'
import { knowsAuth, knowsError, knowsWindowManagement } from '../interfaces'
import LikeButtons from './button/Like'
import TextEditor from './TextEditor'
// FIXME: add debounce to like/dislike api calls

const likeButtonsConfig = {
  showCount: true,
  options: [
    {
      event: 'like',
      value: 'like',
      inactiveClasses: [
        'like'
      ],
      activeClasses: [
        'like',
        'active'
      ],
      showText: false
    },
    {
      event: 'dislike',
      value: 'dislike',
      inactiveClasses: [
        'dislike'
      ],
      activeClasses: [
        'dislike',
        'active'
      ],
      showText: false
    }
  ]
}

export default {
  props: ['room'],
  mixins: [knowsAuth, knowsError, knowsWindowManagement],
  data() {
    return {
      logHistory: [],
      printToConsole: true,
      showlogHistory: false,
      socket: null,
      hasAddedRoom: false,
      messages: [],
      newMessage: null,
      messageLengthLimit: 140,
      lastEvent: null,
      likeButtonsConfig
    }
  },
  watch: {
    isCitizen() {
      this.destroy()
      this.init()
    }
  },
  updated() {
    if(!(this.lastEvent && this.lastEvent.toLowerCase().includes('comment'))) {
      this.scrollToBottom()
    }
  },
  beforeMount() {
    blablabla.getChatHistory(this.room).then(response => {
      let chats = response.data.chats
      chats.reverse()
      this.messages.push(...chats)
    }).catch(error => {
      this.handleError(error)
    })
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    log(eventName) {
      this.logHistory.push(...arguments)
      this.lastEvent = eventName
      if(this.printToConsole) {
        console.log(...['[bla]', ...arguments])
      }
    },
    init() {
      const self = this
      const log = this.log
      this.destroy()
      this.socket = SOCKETIO.initSocketWithAuth(this.getTokenCookie())

      // io events
      this.socket.on('connect', () => {
        log('connect')
      })
      this.socket.on('connect_error', (error) => {
        log('connect_error', error)
      })
      this.socket.on('connect_timeout', (timeout) => {
        log('connect_timeout', timeout)
      })
      this.socket.on('error', (error) => {
        log('error', error)
      })
      this.socket.on('disconnect', (reason) => {
        log('disconnect', reason)
      })
      this.socket.on('reconnecting', (attemptNumber) => {
        log('reconnecting', attemptNumber)
      })
      this.socket.on('reconnect', (attemptNumber) => {
        log('reconnect', attemptNumber)
      })
      this.socket.on('reconnect_error', (error) => {
        log('reconnect_error', error)
      })
      this.socket.on('reconnect_failed', () => {
        log('reconnect_failed')
      })
      this.socket.on('ping', () => {
        log('ping')
      })
      this.socket.on('pong', (latency) => {
        log('pong', latency)
      })

      // blablabla specific events
      this.socket.on('addRoom', (data) => {
        log('addRoom', data)
        this.hasAddedRoom = true
      })
      this.socket.on('leaveRoom', (data) => {
        log('leaveRoom', data)
        this.hasAddedRoom = false
      })
      this.socket.on('chat', (data) => {
        log('chat', data)
        self.messages.push(data)
      })
      this.socket.on('banned', (data) => {
        log('banned', data)
        // TODO: notify if banned
      })
      this.socket.on('comment', (data) => {
        log('comment', data)
        self.setMessageDetail(data)
      })
      this.socket.on('cancelComment', (data) => {
        log('cancelComment', data)
        self.setMessageDetail(data)
      })

      this.socket.emit('addRoom', { room: this.room })
    },
    destroy() {
      if(this.socket && typeof this.socket.close === 'function') {
        this.socket.close()
      }
      this.socket = null
    },
    messageIsLiked(message) {
      return message.detail && message.detail.like && message.detail.like.includes(this.citizen.handle)
    },
    messageIsDisliked(message) {
      return message.detail && message.detail.dislike && message.detail.dislike.includes(this.citizen.handle)
    },
    getMessageState(message) {
      return {
        me: {
          'like': message.detail && message.detail.like && message.detail.like.includes(this.citizen.handle),
          'dislike': message.detail && message.detail.dislike && message.detail.dislike.includes(this.citizen.handle)
        }
      }
    },
    onLike(message) {
      const LIKE = 'like'
      if(this.isCitizen) {
        if(this.messageIsLiked(message)) {
          this.cancelComment(message, LIKE)
        } else {
          this.comment(message, LIKE)
        }
      } else {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      }
    },
    onDislike(message) {
      const DISLIKE = 'dislike'
      if(this.isCitizen) {
        if(this.messageIsDisliked(message)) {
          this.cancelComment(message, DISLIKE)
        } else {
          this.comment(message, DISLIKE)
        }
      } else {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      }
    },
    onSubmit() {
      if(this.isCitizen) {
        if(this.socket && this.newMessage) {
          this.newMessage = this.newMessage.trim().substr(0, this.messageLengthLimit)
          if(this.newMessage !== '') {
            this.socket.emit('chat', {
              room: this.room,
              content: this.newMessage,
              detail: {}
            })
            this.newMessage = null
          }
        }
      } else {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      }
    },
    comment(message, type) {
      if(this.socket) {
        this.socket.emit('comment', {
          room: message.room,
          order: message.order,
          type: type
        })
      }
    },
    cancelComment(message, type) {
      if(this.socket) {
        this.socket.emit('cancelComment', {
          room: message.room,
          order: message.order,
          type: type
        })
      }
    },
    setMessageDetail(data) {
      if(this.socket) {
        for(let i = 0; i < this.messages.length; i++) {
          if(data.order === this.messages[i].order) {
            this.$set(this.messages[i], 'detail', Object.assign({}, data.detail))
            return
          }
        }
      }
    },
    scrollToBottom() {
      let el = this.$el.querySelector('.messages')
      if(el) {
        el.scrollTop = el.scrollHeight
      }
    }
  },
  components: {
    LikeButtons,
    TextEditor
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.blablabla {
  > .messages {
    max-height: 40vh;
    @include vbp-md-up {
      max-height: 50vh;
    }
    @include tcl-md {
      max-height: 60vh;
    }
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    > .message {
      margin: 0.25rem 0;
      > .content {
        > .speaker {
          margin-right: 0.5rem;
          color: $color-secondary-text-grey;
        }
        > .text {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-all;
          word-break: break-word;
          hyphens: auto;
        }
      }
    }
  }
  > .send-message {
    margin: 0.5rem 0;
  }
}
</style>
