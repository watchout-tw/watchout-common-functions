<template>
<div class="avatar">
  <div class="image" :style="imageStyles"></div>
</div>
</template>

<script>
import { knowsAuth } from 'watchout-common-functions/interfaces'
export default {
  mixins: [knowsAuth],
  data() {
    return {
      size: 40,
      width: 36,
      top: 8,
      left: 2
    }
  },
  computed: {
    image() {
      return require('watchout-common-assets/images/avatar/' + (this.isCitizen ? 'default' : 'anon') + '.png')
    },
    imageStyles() {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
        backgroundImage: 'url(' + this.image + ')',
        backgroundSize: this.width + 'px',
        backgroundPosition: `${this.left}px ${this.top}px`
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
}
</style>
