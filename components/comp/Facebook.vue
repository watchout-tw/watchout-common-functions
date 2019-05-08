<template>
<div class="comp-facebook tcl-container">
  <div class="video facebook tcl-panel" v-if="type === TYPES.VIDEO">
    <div class="video-content-container">
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
  'videos': TYPES.VIDEO,
  'posts': TYPES.POST
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
    embedURL() {
      let url = null
      if(this.type === TYPES.VIDEO) {
        url = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${this.user}%2Fvideos%2F${this.id}%2F&show_text=false`
      }
      return url
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-facebook {
  > .video {
    > .video-content-container {
      @include rect(16/9);
      > .content {
        width: 100%;
        height: 100%;
        @include shadow-expanded;
      }
    }
  }
}
</style>
