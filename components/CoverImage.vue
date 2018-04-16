<template>
<div class="cover-image" :class="classes" :width="width" :style="styles">
</div>
</template>

<script>
export default {
  props: ['url', 'width', 'classes'],
  computed: {
    image() {
      if(this.url.includes('http')) {
        return this.url
      } else {
        return 'https://raw.githubusercontent.com/watchout-tw/watchout-common-assets/master/images/' + this.url
      }
    },
    styles() {
      return {
        backgroundImage: `url(${this.image})`
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.cover-image {
  &[width="2"] {
    @include rect(2/1);
  }
  &[width="4"] {
    @include rect(4/1);
  }
  background-size: cover;
  background-position: center center;
  
  &.shadow {
    @include shadow;
  }
}
</style>
