<template>
<div class="cover-image" :style="styles">
</div>
</template>

<script>
export default {
  props: ['url'],
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
  @include rect(4/1);
  background-size: cover;
  background-position: center center;
}
</style>
