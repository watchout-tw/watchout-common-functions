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
  <form class="send-message" @keyup.13.prevent="sendMessage" @submit.prevent>
    <div class="field with-button">
      <text-editor placeholder="輸入訊息" v-model="newMessage" :classes="['park']" :simple="true" key="newMessage" />
      <button class="button small park" @click="sendMessage">送出</button>
    </div>
  </form>
</div>
</template>

<script>
import * as SOCKETIO from '../lib/socket.io.js'
import { knowsAuth } from '../interfaces'
import LikeButtons from './button/Like'
import TextEditor from './TextEditor'
// FIXME: add debounce to like/dislike api calls
let socket

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
  mixins: [knowsAuth],
  data() {
    return {
      messages: [],
      newMessage: null,
      likeButtonsConfig
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
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
      console.log('onlike')
      const LIKE = 'like'
      if(this.messageIsLiked(message)) {
        this.cancelComment(message, LIKE)
      } else {
        this.comment(message, LIKE)
      }
    },
    onDislike(message) {
      console.log('ondislike')
      const DISLIKE = 'dislike'
      if(this.messageIsDisliked(message)) {
        this.cancelComment(message, DISLIKE)
      } else {
        this.comment(message, DISLIKE)
      }
    },
    sendMessage: function() {
      if(this.newMessage) {
        socket.emit('chat', {
          room: this.room,
          content: this.newMessage,
          detail: {}
        })
        this.newMessage = null
      }
    },
    comment: function(message, type) {
      socket.emit('comment', {
        room: message.room,
        order: message.order,
        type: type
      })
    },
    cancelComment: function(message, type) {
      socket.emit('cancelComment', {
        room: message.room,
        order: message.order,
        type: type
      })
    },
    setMessageDetail: function(data) {
      for(let i = 0, l = this.messages.length; i < l; i++) {
        if(data.order === this.messages[i].order) {
          this.messages[i].detail = data.detail
          return
        }
      }
    }
  },
  mounted() {
    const V_THIS = this
    socket = SOCKETIO.initSocketWithAuth(this.getTokenCookie())

    socket.on('addRoom', (data) => {
      console.log('addRoom', data)
    })

    socket.on('leaveRoom', (data) => {
      console.log(data)
      // TODO: close this chat room
    })

    socket.on('chat', (data) => {
      console.log('catch chat', data)
      V_THIS.messages.push(data)
    })

    socket.on('banned', (data) => {
      console.log('banned', data)
      // TODO: do something for banned
    })

    socket.on('comment', (data) => {
      console.log('comment', data)
      V_THIS.setMessageDetail(data)
    })

    socket.on('cancelComment', (data) => {
      console.log(data)
      V_THIS.setMessageDetail(data)
    })

    socket.emit('addRoom', {room: this.room})
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
