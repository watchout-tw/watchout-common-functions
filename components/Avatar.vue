<template>
<div class="avatar" :class="classes">
  <div class="image" :style="imageStyles"></div>
</div>
</template>

<script>

const DEFAULT_SIZE = 48
const DEFAULT_WIDTH = 48
const DEFAULT_TOP = 0
const DEFAULT_LEFT = 0

const systemAvatars = [
  {
    id: 'anon',
    size: DEFAULT_SIZE,
    width: 44,
    top: 8,
    left: 2
  },
  {
    id: 'default',
    size: DEFAULT_SIZE,
    width: DEFAULT_WIDTH,
    top: DEFAULT_TOP,
    left: DEFAULT_LEFT
  }
]

export default {
  props: ['avatar', 'classes'],
  computed: {
    internalAvatar() {
      let type = 'system'
      let id = 'default'
      let url = null
      let dimensions = Object.assign({}, systemAvatars.find(avatar => avatar.id === 'id'))
      if(this.avatar) {
        if(typeof this.avatar === 'string') {
          id = this.avatar
        } else if(typeof this.avatar === 'object') {
          if(this.avatar.type === 'system' && this.avatar.hasOwnProperty('id')) {
            id = this.avatar.id
          } else {
            type = this.avatar.type
            id = null
            url = this.avatar.url
          }
        }
        dimensions = id === 'anon' ? systemAvatars.find(avatar => avatar.id === 'anon') : (type === 'system' ? systemAvatars.find(avatar => avatar.id === 'default') : this.avatar)
      }
      url = id ? `${id}.png` : url
      let image = require('watchout-common-assets/images/avatar/' + url)
      return Object.assign({ type, image }, dimensions)
    },
    imageStyles() {
      let r = 1
      if(this.classes) {
        if(this.classes.includes('small')) {
          r = 0.5
        } else if(this.classes.includes('large')) {
          r = 2
        }
      }
      let size = this.internalAvatar.size * r
      let width = this.internalAvatar.width * r
      let top = this.internalAvatar.top * r
      let left = this.internalAvatar.left * r
      return {
        width: size + 'px',
        height: size + 'px',
        backgroundImage: 'url(' + this.internalAvatar.image + ')',
        backgroundSize: width + 'px',
        backgroundPosition: `${left}px ${top}px`
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.avatar {
  > .image {
    border-radius: 50%;
    background-color: $color-avatar-background-white;
    background-repeat: no-repeat;
  }
  &.shadow {
    > .image {
      @include shadow;
    }
  }
  &.inline {
    display: inline-block;
    vertical-align: middle;
  }
  &.centered {
    display: flex;
    justify-content: center;
  }
}
</style>
