<template>
<div class="blablabla">
  <div class="messages font-size-smaller">
    <div class="not-available text-align-center" v-if="messages.length < 1">暫時沒有訊息</div>
    <div class="message" v-for="message in messages" :key="message.time">
      <div class="content">
        <span class="speaker">{{ message.alias }}</span><span class="text">{{ message.content }}</span>
      </div>
      <like-buttons :config="likeButtonsConfig" :state="getMessageState(message)" @like="onLike(message)"  @dislike="onDislike(message)">
        <template slot="like-count">{{ message.detail && message.detail.like ? message.detail.like.length : 0 }}</template>
        <template slot="dislike-count">{{ message.detail && message.detail.dislike ? message.detail.dislike.length : 0 }}</template>
      </like-buttons>
    </div>
  </div>
  <form class="send-message" @keyup.13.prevent="onSubmit" @submit.prevent>
    <div class="field with-button">
      <text-editor placeholder="輸入訊息" v-model="newMessage" :classes="['park']" :simple="true" :maxlength="messageLengthLimit" key="newMessage" />
      <button class="button small park" @click="onSubmit">送出</button>
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
      isInDebugMode: true,
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
      if(this.socket && !this.socket.connected) {
        this.init()
      }
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
    log() {
      if(this.isInDebugMode) {
        console.log(...['[bla]', ...arguments])
      }
    },
    init() {
      const self = this
      const log = this.log
      this.socket = SOCKETIO.initSocketWithAuth(this.getTokenCookie())

      this.socket.on('addRoom', (data) => {
        log('addRoom', data)
        this.hasAddedRoom = true
        this.lastEvent = 'addRoom'
      })
      this.socket.on('leaveRoom', (data) => {
        log('leaveRoom', data)
        this.hasAddedRoom = false
        this.lastEvent = 'leaveRoom'
      })
      this.socket.on('chat', (data) => {
        log('chat', data)
        self.messages.push(data)
        this.lastEvent = 'chat'
      })
      this.socket.on('banned', (data) => {
        log('banned', data)
        // TODO: notify if banned
      })
      this.socket.on('comment', (data) => {
        log('comment', data)
        self.setMessageDetail(data)
        this.lastEvent = 'comment'
      })
      this.socket.on('cancelComment', (data) => {
        log('cancelComment', data)
        self.setMessageDetail(data)
        this.lastEvent = 'cancelComment'
      })

      this.socket.emit('addRoom', { room: this.room })
    },
    destroy() {
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
    max-height: 20rem;
    overflow: scroll;
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
