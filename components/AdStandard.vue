<template>
<component class="ad standard" :is="hasLink ? 'a' : 'div'" :href="hasLink ? link : null" target="_blank" :class="containerClasses" :style="containerStyles">
  <div class="content" :class="contentClasses">{{ contentText }}</div>
</component>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    hasData() {
      return this.data !== undefined && typeof this.data === 'object'
    },
    hasLink() {
      return this.hasData && this.data.link && this.data.link.url
    },
    contentText() {
      let text = '這是廣告'
      if(this.hasData) {
        if(this.type === 'text') {
          text = this.data.content.text
        } else if(this.type === 'image') {
          text = ''
        }
      }
      return text
    },
    type() {
      return this.hasData ? this.data.type : null
    },
    link() {
      return this.hasLink ? this.data.link.url : null
    },
    containerClasses() {
      let classes = [this.type]
      if(!this.hasData) {
        classes.push('empty')
      }
      if(this.hasLink) {
        classes.push('shadow')
      }
      return classes
    },
    containerStyles() {
      let styles = {}
      if(this.type === 'image') {
        let content = this.data.content.url
        if(!content.includes('http')) {
          content = require('watchout-common-assets/images/ads/' + content)
        }
        styles.backgroundImage = 'url(' + content + ')'
      }
      return styles
    },
    contentClasses() {
      let classes = []
      if(!this.hasData) {
        classes.push('not-available', 'font-size-small')
      }
      return classes
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.ad.standard {
  @include rect(4/1);
  &.size-41 {
    @include rect(4/1);
  }
  &.size-31 {
    @include rect(3/1);
  }
  &.empty {
    background-color: $color-very-light-grey;
  }
  &.image {
    background-size: contain;
  }
  &.shadow {
    @include shadow;
  }
  > .content {
    padding: 1rem;
  }
}
</style>
