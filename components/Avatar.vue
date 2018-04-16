<template>
<div class="avatar" :class="classes">
  <div class="image" :style="imageStyles"></div>
</div>
</template>

<script>

const systemAvatars = [
  {
    id: 'anon',
    size: 48,
    width: 44,
    top: 8,
    left: 2
  },
  {
    id: 'default',
    size: 48,
    width: 48,
    top: 0,
    left: 0
  }
]

export default {
  props: ['avatar', 'classes'],
  computed: {
    internalAvatar() {
      let type = 'system'
      let id = 'default'
      let url = null
      if(this.avatar) {
        if(typeof this.avatar === 'string') {
          id = this.avatar
        } else if(typeof this.avatar === 'object') {
          if(this.avatar.type === 'system') {
            id = this.avatar.id
          } else {
            type = this.avatar.type
            id = null
            url = this.avatar.url
          }
        }
      }

      let image = id ? require('watchout-common-assets/images/avatar/' + id + '.png') : url
      let dimensions = type === 'system' ? systemAvatars.find(avatar => avatar.id === id) : this.avatar
      return {
        type,
        image,
        size: dimensions.size,
        width: dimensions.width,
        top: dimensions.top,
        left: dimensions.left
      }
    },
    imageStyles() {
      let d = this.classes && this.classes.includes('small') ? 2 : 1
      return {
        width: this.internalAvatar.size / d + 'px',
        height: this.internalAvatar.size / d + 'px',
        backgroundImage: 'url(' + this.internalAvatar.image + ')',
        backgroundSize: this.internalAvatar.width / d + 'px',
        backgroundPosition: `${this.internalAvatar.left / d}px ${this.internalAvatar.top / d}px`
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
}
</style>
