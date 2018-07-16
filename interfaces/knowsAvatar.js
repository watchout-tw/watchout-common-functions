import systemAvatars from 'watchout-common-functions/lib/avatars'

export default {
  methods: {
    getSystemAvatar(id) {
      return Object.assign({}, systemAvatars.find(avatar => avatar.id === id))
    }
  }
}
