<template>
<div class="cover-image" :class="classes" :width="width" :style="styles">
  <div v-if="label" class="label">{{ label }}</div>
</div>
</template>

<script>
export default {
  props: ['url', 'label', 'type', 'width', 'classes'],
  computed: {
    image() {
      if(!this.url) {
        return null
      } else if(this.url.includes('http')) {
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
  background-size: contain;
  background-position: center center;

  &.shadow {
    @include shadow;
  }

  > .label {
    position: absolute;
    top: 50%;
    left: 50%;
    line-height: 1;
    padding: 0.25rem;
    transform: translate(-50%, -50%);
    background: white;
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>
