<template>
<div class="blablabla">
  <p>This is blablabla</p> <!-- FIXME: It's just fake title for test. -->
  <div class="message" v-for="message in messages" :key="message.time">
    <p>{{message.talker}}</p>
    <p>{{message.content}}</p>
    <button @click="comment(message, 'like')">like: {{message.detail.like ? message.detail.like.length : 0}}</button>
    <button @click="cancelComment(message, 'like')">cancel like</button>
    <button @click="comment(message, 'dislike')">dislike: {{message.detail.dislike ? message.detail.dislike.length : 0}}</button>
    <button @click="cancelComment(message, 'dislike')">cancel like</button>
  </div>
  <input v-model="newMessage" />
  <button @click="sendMessage()">send</button>
</div>
</template>

<script>
import socket from '../lib/socket.io.js'

export default {
  props: ['roomId'],
  data() {
    return {
      messages: [],
      newMessage: ''
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    sendMessage: function() {
      socket.emit('chat', {
        room: this.roomId,
        content: this.newMessage,
        detail: {}
      })
      this.newMessage = ''
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
    console.log('room', this.roomId)
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

    socket.emit('addRoom', {room: this.roomId})
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.blablabla {
  /* FIXME: styles below are just for test, they are not OK */
  color: green;
  .message {
    border: 1px solid green;
  }
}
</style>
