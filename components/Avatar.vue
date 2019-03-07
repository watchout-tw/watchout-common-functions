<template>
<component :is="componentIsTag" :href="internalLink" class="avatar" :class="internalClasses">
  <div v-if="isShowing('avatar')" class="avatar-image-container">
    <div class="image" :style="avatarImageStyles"></div>
    <div v-if="isShowingParty" class="party-flag-container">
      <party-flag :id="internalParty" :parties="parties" :class="!isLarge ? 'small' : ''"></party-flag>
    </div>
    <div v-if="index" class="index d-flex align-items-center justify-content-center text-align-center" :class="indexClasses"><span>{{ index }}</span></div>
  </div>
  <div v-if="isShowing('name')" class="name line-height-tight">
    <span class="a-target">{{ internalName }}</span>
  </div>
  <div v-if="secondaryText" class="secondary-text line-height-tight" :class="secondaryClasses">
    <span>{{ secondaryText }}</span>
  </div>
  <identity v-if="isShowing('identity')" :persona="persona" class="small" />
</component>
</template>

<script>
import { knowsAvatar, knowsWatchout } from 'watchout-common-functions/interfaces'
import PartyFlag from './PartyFlag'
import Identity from './Identity'

/*
Sizes: small, normal (default), large
Classes: horizontal, shadow
Induced classes: small (from size), shadow (from link)
Inherent classes: deactivated (from Persona.status)
Show: avatar, name, identity
*/

export default {
  mixins: [knowsAvatar, knowsWatchout],
  props: ['size', 'show', 'persona', 'avatar', 'name', 'link', 'classes', 'secondaryText', 'secondaryClasses', 'index', 'indexClasses', 'parties'],
  computed: {
    componentIsTag() {
      return this.hasLink ? 'a' : 'div'
    },
    internalLink() {
      return typeof this.link === 'string' ? this.link : (this.link && this.persona ? this.getParkPersonaProfileURL(this.persona.id) : null)
    },
    hasLink() {
      return !!(this.internalLink)
    },
    isSmall() {
      return this.size === 'small'
    },
    isLarge() {
      return this.size === 'large'
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
        classes.push('shadow')
      }
      if(this.isSmall) {
        classes.push('small')
      }
      if(this.persona) {
        classes.push(this.persona.status)
      }
      classes = [...new Set(classes)]
      return classes
    },
    internalAvatar() {
      let type = 'system'
      let id = 'default'
      let url = null
      let dimensions = this.getSystemAvatar(id)

      let avatar = this.avatar ? this.avatar : (this.persona ? this.persona.avatar : 'anon')
      if(avatar) {
        if(typeof avatar === 'string') {
          id = avatar
        } else if(typeof avatar === 'object' && avatar.hasOwnProperty('type') && !(!avatar.hasOwnProperty('id') && !avatar.hasOwnProperty('url'))) {
          // custom avatar data obj require type
          // EITHER id OR url
          type = avatar.type
          id = avatar.id ? avatar.id : null
          url = avatar.url ? avatar.url : null
        }
        dimensions = type === 'system' ? this.getSystemAvatar('default') : Object.assign({}, avatar)
      }
      // FIXME: assume everything is github://
      url = 'https://raw.githubusercontent.com/watchout-tw/watchout-common-assets/master/images/avatar/' + (id ? `${id}.png` : url)
      return Object.assign({ type, image: url }, dimensions)
    },
    avatarImageStyles() {
      let r = 1 // normal
      if(this.size === 'small') {
        r = 0.5
      } else if(this.size === 'large') {
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
    },
    internalName() {
      let name = this.name ? this.name : (this.persona ? this.persona.name : null)
      if([undefined, null, ''].includes(name)) {
        name = '顯示名稱尚未設定'
        if([undefined, null].includes(this.persona)) {
          name = '查無此人'
        }
      }
      return name
    },
    isShowingParty() {
      return this.persona ? !(this.persona && this.persona.type === 'default') : false
    },
    internalParty() {
      return this.persona && this.persona.data ? this.persona.data.party : null
    }
  },
  methods: {
    isShowing(key) {
      return Array.isArray(this.show) ? this.show.includes(key) : false
    }
  },
  components: {
    PartyFlag,
    Identity
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.avatar {
  margin: 0.25rem;
  > .avatar-image-container {
    position: relative;
    display: flex;
    justify-content: center;
    > .image {
      position: relative;
      border-radius: 50%;
      background-color: $color-avatar-background-white;
      background-repeat: no-repeat;
    }
    > .index.candidate-number {
      $size: 1.25rem;
      position: absolute;
      right: $size / -2;
      bottom: 0;
      width: $size;
      height: $size;
      border-radius: $size;
      background: $color-avatar-background-white;
      border: $color-musou 2px solid;
      font-size: $font-size-small;
      font-weight: bold;
      color: $color-musou;
      @include shadow;
    }
  }
  &.shadow {
    > .avatar-image-container {
      > .image {
        @include shadow;
      }
    }
  }
  &:not(.small) {
    > .avatar-image-container {
      > .party-flag-container {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(75%);
      }
    }
  }
  &.small {
    > .avatar-image-container {
      display: flex;
      flex-direction: row;
      align-items: center;
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
    > .name:first-child {
      padding-left: 0.125em;
    }
  }
  &.vertical {
    position: relative;
    text-align: center;
    > .name {
      margin: 0.25rem 0 0;
      font-size: $font-size-small;
    }
    > .secondary-text {
      margin: 0.25rem 0;
    }
  }
  &.deactivated {
    filter: grayscale(1);
  }
  > .score {
    margin: 0 0.25rem;
    padding: 0.125rem 0.25rem;
  }
}
</style>
