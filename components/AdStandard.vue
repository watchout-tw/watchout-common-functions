<template>
<div class="ad standard">
  <component :is="hasLink ? 'a' : 'div'" :href="hasLink ? data.link.url : null" target="_blank" class="content" :class="contentClasses" v-if="data" :style="contentStyles"></component>
</div>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    hasLink() {
      return this.data.link && this.data.url
    },
    contentClasses() {
      let classes = []
      if(this.hasLink) {
        classes.push('shadow')
      }
      return classes
    },
    contentStyles() {
      let styles = {}
      if(this.data.type === 'image') {
        let image = require('watchout-common-assets/images/ads/' + this.data.url)
        styles.backgroundImage = 'url(' + image + ')'
      }
      return styles
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.ad.standard {
  > .content {
    @include rect(4/1);
    background-size: contain;
    border-radius: 1px;

    &.shadow {
      @include shadow;
    }
  }
}
</style>
