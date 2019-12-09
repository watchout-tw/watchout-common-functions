<template>
<div class="comp-facebook tcl-container">
  <div class="content-wrapper tcl-panel">
    <div class="content-container" :class="classes">
      <iframe class="content" :src="embedURL" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media" allowFullScreen="true"></iframe>
    </div>
  </div>
</div>
</template>

<script>
const TYPES = {
  VIDEO: 'video',
  POST: 'post'
}
const TYPE_MAP = {
  videos: TYPES.VIDEO,
  posts: TYPES.POST
}

export default {
  props: ['reference'],
  data() {
    return {
      TYPES,
      TYPE_MAP
    }
  },
  computed: {
    user() {
      let segments = this.reference.id.split('/')
      return segments[0]
    },
    type() {
      let segments = this.reference.id.split('/')
      return TYPE_MAP[segments[1]]
    },
    id() {
      let segments = this.reference.id.split('/')
      return segments[2]
    },
    classes() {
      let classes = [this.type]
      let ratio = '16-9'
      if(this.reference && this.reference.params && this.reference.params.ratio) {
        ratio = this.reference.params.ratio
      }
      classes.push('ratio-' + ratio)
      return classes
    },
    embedURL() {
      let url = null
      if(this.type === TYPES.VIDEO) {
        url = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.user}%2Fvideos%2F${this.id}%2F&show_text=false`
      } else if(this.type === TYPES.POST) {
        url = `https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.user}%2Fposts%2F${this.id}%2F&show_text=false&width=auto`
      }
      return url
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-facebook {
  > .content-wrapper {
    > .content-container {
      background-color: $color-nice-grey;
      @include shadow-expanded;
      &.video {
        width: 100%;
      }
      &.post {
        width: 100%;
        border-radius: 0.25rem;
      }
      &.ratio-2-1 {
        @include rect(2/1);
      }
      &.ratio-16-9 {
        @include rect(16/9);
      }
      &.ratio-1-1 {
        @include rect(1);
      }
      &.ratio-9-16 {
        @include rect(9/16);
      }
      &.ratio-1-2 {
        @include rect(1/2);
      }
    }
  }
}
</style>
