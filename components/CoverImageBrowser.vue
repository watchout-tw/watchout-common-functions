<template>
<div class="cover-image-browser">
  <div class="options" v-for="option of internalOptions">
    {{ option }}
  </div>
</div>
</template>

<script>
const defaultOptions = [
  'watchout-common-assets/images/cover-images/1.png',
  'watchout-common-assets/images/cover-images/2.png',
  'watchout-common-assets/images/cover-images/3.png',
  'watchout-common-assets/images/cover-images/4.png',
  'watchout-common-assets/images/cover-images/5.png',
  'watchout-common-assets/images/cover-images/6.png'
]

export default {
  props: ['limit', 'selectedOptions', 'options'],
  computed: {
    internalOptions() {
      return Array.isArray(this.options) ? this.options : defaultOptions
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

</style>
