<template>
<div class="blablabla">
  <div class="messages">
    <div class="not-available text-align-center" v-if="messages.length < 1">暫時沒有訊息</div>
    <div class="message" v-for="message in messages" :key="message.time">
      <div class="content">
        <span class="talker">{{ message.talker }}</span><span class="text">{{ message.content }}</span>
      </div>
      <like-buttons :config="likeButtonsConfig" :state="getMessageState(message)" @like="onLike(message)"  @dislike="onDislike(message)">
        <template slot="like-count">{{ message.detail.like ? message.detail.like.length : 0 }}</template>
        <template slot="dislike-count">{{ message.detail.dislike ? message.detail.dislike.length : 0 }}</template>
      </like-buttons>
    </div>
  </div>
  <form class="send-message" @keyup.13.prevent="onSubmit" @submit.prevent>
    <div class="field with-button">
      <text-editor placeholder="輸入訊息" v-model="newMessage" :classes="['park']" :simple="true" key="newMessage" />
      <button class="button small park" @click="onSubmit">送出</button>
    </div>
  </form>
</div>
</template>

<script>
import * as SOCKETIO from '../lib/socket.io.js'
import { knowsAuth, knowsWindowManagement } from '../interfaces'
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
  mixins: [knowsAuth, knowsWindowManagement],
  data() {
    return {
      socket: null,
      isInitialized: false,
      messages: [],
      newMessage: null,
      likeButtonsConfig
    }
  },
  watch: {
    isCitizen() {
      if(this.isCitizen) {
        this.init()
      } else {
        this.destroy()
      }
    }
  },
  methods: {
    init() {
      const self = this
      this.socket = SOCKETIO.initSocketWithAuth(this.getTokenCookie())

      this.socket.on('addRoom', (data) => {
        console.log('addRoom', data)
      })
      this.socket.on('leaveRoom', (data) => {
        console.log(data)
        // TODO: close this chat room
      })
      this.socket.on('chat', (data) => {
        console.log('catch chat', data)
        self.messages.push(data)
      })
      this.socket.on('banned', (data) => {
        console.log('banned', data)
        // TODO: do something for banned
      })
      this.socket.on('comment', (data) => {
        console.log('comment', data)
        self.setMessageDetail(data)
      })
      this.socket.on('cancelComment', (data) => {
        console.log(data)
        self.setMessageDetail(data)
      })

      this.socket.emit('addRoom', { room: this.room })
      this.isInitialized = true
    },
    destroy() {
      this.socket = null
      this.isInitialized = false
    },
    messageIsLiked(message) {
      return message.detail.like && message.detail.like.includes(this.citizen.handle)
    },
    messageIsDisliked(message) {
      return message.detail.dislike && message.detail.dislike.includes(this.citizen.handle)
    },
    getMessageState(message) {
      return {
        me: {
          'like': message.detail.like && message.detail.like.includes(this.citizen.handle),
          'dislike': message.detail.dislike && message.detail.dislike.includes(this.citizen.handle)
        }
      }
    },
    onLike(message) {
      const LIKE = 'like'
      if(this.messageIsLiked(message)) {
        this.cancelComment(message, LIKE)
      } else {
        this.comment(message, LIKE)
      }
    },
    onDislike(message) {
      const DISLIKE = 'dislike'
      if(this.messageIsDisliked(message)) {
        this.cancelComment(message, DISLIKE)
      } else {
        this.comment(message, DISLIKE)
      }
    },
    onSubmit() {
      if(this.isCitizen) {
        if(this.socket && this.newMessage) {
          this.socket.emit('chat', {
            room: this.room,
            content: this.newMessage,
            detail: {}
          })
          this.newMessage = null
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
        for(let i = 0, l = this.messages.length; i < l; i++) {
          if(data.order === this.messages[i].order) {
            this.messages[i].detail = data.detail
            return
          }
        }
      }
    }
  },
  mounted() {
    if(this.isCitizen) {
      this.init()
    } else {
      console.warn('Not logged in')
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
    > .message {
      margin: 0.25rem 0;
       > .content {
         > .talker {
           margin-right: 1rem;
           color: $color-secondary-text-grey;
         }
       }
    }
  }
}
</style>
