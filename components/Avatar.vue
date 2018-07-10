<template>
<component :is="hasLink ? 'a' : 'div'" :href="link" class="avatar" :class="{ 'a-block': hasLink, 'horizontal': isHorizontal, 'vertical': isVertical}">
  <div class="avatar-image" :class="classes">
    <div class="image" :style="imageStyles"></div>
  </div>
  <div v-if="name && isVertical" class="name margin-top-4 line-height-tight font-size-small">
    <label class="a-target">{{ name }}</label>
  </div>
  <div v-if="secondaryText && isVertical" :class="secondaryClasses">
    <label>{{ secondaryText }}</label>
  </div>
  <div v-if="decoration" class="flag">
    <party-flag :id="decoration.data" :parties="decorationRef" class="small"></party-flag>
  </div>
  <span v-if="name && isHorizontal" class="name a-target">{{ name ? name : '作者尚未設定顯示名稱' }}</span>
  <span v-if="secondaryText && isHorizontal" :class="secondaryClasses">{{ secondaryText }}</span>
</component>
</template>

<script>
import PartyFlag from './PartyFlag'

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

// Size: small, normal, large

export default {
  props: ['orientation', 'avatar', 'name', 'link',  'size', 'classes',
    'secondaryText', 'secondaryClasses', 'decoration', 'decorationRef'],
  computed: {
    hasLink() {
      return !!(this.link)
    },
    isHorizontal () {
      return this.orientation === 'horizontal'
    },
    isVertical () {
      return this.orientation === 'vertical'
    },
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
      let image
      try {
        image = require('watchout-common-assets/images/avatar/' + url)
      } catch(e) {
        image = require('watchout-common-assets/images/avatar/default.png')
      }
      return Object.assign({ type, image }, dimensions)
    },
    imageStyles () {
      let r = 1 // normal
      if (this.size === 'small') {
        r = 0.5
      } else if (this.size === 'large') {
        r = 2
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
  },
  components: {
    PartyFlag
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.avatar {
  > .avatar-image {
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
  &.horizontal {
    margin: 0.25rem 0;
    > .name {
      line-height: $line-height-tight;
      margin-top: 0.125rem;
      margin-left: 0.25rem;
    }
    > .score {
      margin: 0 0.25rem;
      padding: 0.125rem 0.25rem;
    }
  }
  &.vertical {
    position: relative;
    margin: 0.5rem;
    > .flag {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(12.5%, -50%);
    }
  }
}
</style>