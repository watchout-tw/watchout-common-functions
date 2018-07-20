<template>
<avatar :size="size" :show="show" :avatar="avatar" :name="name" :classes="classes" />
</template>

<script>
import { knowsAuth, knowsAvatar } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'
export default {
  mixins: [knowsAuth, knowsAvatar],
  props: ['size', 'show', 'classes'],
  computed: {
    hasActivePersona() {
      return this.isCitizen && this.activePersona
    },
    avatar() {
      let avatar = null
      if(this.isShowing('avatar')) {
        if(this.hasActivePersona) {
          avatar = this.activePersona.avatar ? this.activePersona.avatar : 'default'
        } else {
          avatar = 'anon'
        }
      }
      return avatar
    },
    name() {
      let name = null
      if(this.isShowing('name')) {
        if(this.hasActivePersona) {
          name = this.activePersona.name ? this.activePersona.name : '顯示名稱尚未設定'
        } else {
          name = '路人'
        }
      }
      return name
    }
  },
  methods: {
    isShowing(key) {
      return Array.isArray(this.show) ? this.show.includes(key) : false
    }
  },
  components: {
    Avatar
  }
}
</script>
