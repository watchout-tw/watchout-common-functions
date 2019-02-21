<template>
<div class="comp-video tcl-container">
  <div class="video youtube tcl-panel full-width" v-if="reference.type === 'youtube'">
    <div class="video-content-container">
      <iframe class="content" :src="`https://www.youtube.com/embed/${reference.id}`" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['reference']
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-video {
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
