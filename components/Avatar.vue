<template>
<component :is="hasLink ? 'a' : 'div'" :href="link" class="avatar" :class="internalClasses">
  <div v-if="isShowing('avatar')" class="avatar-image-container">
    <div class="image" :style="imageStyles"></div>
    <div v-if="party && parties" class="party-flag-container">
      <party-flag :id="party" :parties="parties" class="small"></party-flag>
    </div>
  </div>
  <div v-if="isShowing('name')" class="name line-height-tight">
    <span class="a-target">{{ name !== null && name !== '' ? name : '顯示名稱尚未設定' }}</span>
  </div>
  <div v-if="secondaryText" class="secondary-text line-height-tight" :class="secondaryClasses">
    <span>{{ secondaryText }}</span>
  </div>
</component>
</template>

<script>
import { knowsAvatar } from 'watchout-common-functions/interfaces'
import PartyFlag from './PartyFlag'

/*
Sizes: small, normal (default), large
Classes: shadow, centered
Induced classes: small (from size)
Inherent classes: deactivated (from Persona.status)
*/

export default {
  mixins: [knowsAvatar],
  props: ['size', 'show', 'avatar', 'name', 'link', 'classes', 'secondaryText', 'secondaryClasses', 'party', 'parties'],
  computed: {
    hasLink() {
      return !!(this.link)
    },
    isSmall() {
      return this.size === 'small'
    },
    isHorizontal() {
      return Array.isArray(this.classes) && this.classes.includes('horizontal')
    },
    isVertical() {
      return Array.isArray(this.classes) && this.classes.includes('vertical')
    },
    internalClasses() {
      let classes = [].concat(Array.isArray(this.classes) ? this.classes : [])
      if(this.hasLink) {
        classes.push('a-block')
      }
      if(this.isSmall) {
        classes.push('small')
      }
      return classes
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
  methods: {
    isShowing(key) {
      return Array.isArray(this.show) ? this.show.includes(key) : false
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
  margin: 0.25rem;
  > .avatar-image-container {
    position: relative;
    > .image {
      border-radius: 50%;
      background-color: $color-avatar-background-white;
      background-repeat: no-repeat;
    }
  }
  &.shadow {
    > .avatar-image-container {
      > .image {
        @include shadow;
      }
    }
  }
  &.centered {
    > .avatar-image-container {
      display: flex;
      justify-content: center;
    }
  }
  &:not(.small) {
    > .avatar-image-container {
      > .party-flag-container {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(50%);
      }
    }
  }
  &.small {
    > .avatar-image-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      > .party-flag-container {
        transform: translateX(-12.5%);
      }
    }
  }
  &.horizontal {
    display: flex;
    flex-direction: row;
    align-items: center;
    &.small {
      > .name {
        padding: 0 0.25em;
        font-size: $font-size-small;
      }
    }
    &:not(.small) {
      > .name {
        padding: 0 0.5em;
      }
    }
  }
  &.vertical {
    position: relative;
    text-align: center;
    > .name {
      margin: 0.25rem 0;
      font-size: $font-size-small;
    }
    > .secondary-text {
      margin: 0.25rem 0;
    }
  }
  &.deactivated {
    filter: grayscale(1);
    opacity: 0.5;
  }
  > .score {
    margin: 0 0.25rem;
    padding: 0.125rem 0.25rem;
  }
}
</style>
