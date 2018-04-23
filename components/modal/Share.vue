<template>
<div class="modal share">
  <div :style="facebook"></div>
  {{ data.url }}
</div>
</template>

<script>

export default {
  props: ['data'],
  computed: {
    facebook () {
      return {
        backgroundImage: 'url(' + require('watchout-common-assets/images/platforms/facebook.png') + ')'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.share {
  position: relative;
  width: 18rem;
  padding: 1rem;
  background-color: $color-park-light;
  @include shadow;
}
</style>
