<template>
<component :is="hasLink ? 'a' : 'div'" :href="link" class="avatar" :class="{ 'a-block': hasLink, 'horizontal': isHorizontal, 'vertical': isVertical}">
  <div class="avatar-image" :class="classes">
    <div class="image" :style="imageStyles"></div>
  </div>
  <div v-if="name && isVertical" class="name margin-top-4 line-height-tight font-size-small">
    <span class="a-target">{{ name }}</span>
  </div>
  <div v-if="secondaryText && isVertical" class="secondary-text line-height-tight margin-top-4" :class="secondaryClasses">
    <span>{{ secondaryText }}</span>
  </div>
  <div v-if="party" class="party-flag-container">
    <party-flag :id="party" :parties="parties" class="small"></party-flag>
  </div>
  <span v-if="name && isHorizontal" class="name a-target">{{ name ? name : '作者尚未設定顯示名稱' }}</span>
  <span v-if="secondaryText && isHorizontal" :class="secondaryClasses">{{ secondaryText }}</span>
</component>
</template>

<script>
import { knowsAvatar } from 'watchout-common-functions/interfaces'
import PartyFlag from './PartyFlag'

/*
Sizes: small, normal, large
Classes: shadow, centered
*/

export default {
  mixins: [knowsAvatar],
  props: ['size', 'avatar', 'name', 'link', 'classes', 'secondaryText', 'secondaryClasses', 'party', 'parties'],
  computed: {
    hasLink() {
      return !!(this.link)
    },
    isHorizontal() {
      return Array.isArray(this.classes) && this.classes.includes('horizontal')
    },
    isVertical() {
      return Array.isArray(this.classes) && this.classes.includes('vertical')
    },
    internalAvatar() {
      let type = 'system'
      let id = 'default'
      let url = null
      let dimensions = this.getSystemAvatar(id)
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
        dimensions = id === 'anon' ? this.getSystemAvatar('anon') : (type === 'system' ? this.getSystemAvatar('default') : Object.assign({}, this.avatar))
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
    imageStyles() {
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
    > .party-flag-container {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(12.5%, -50%);
    }
  }
}
</style>
