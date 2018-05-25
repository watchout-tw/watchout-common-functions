<template>
<div class="cover-image" :class="classes" :width="width" :style="styles">
  <div class="labels">
    <div v-if="label" class="label">{{ label }}</div>
    <div v-if="secondaryLabel" class="secondary-label">{{ secondaryLabel }}</div>
  </div>
</div>
</template>

<script>
export default {
  props: ['url', 'label', 'secondaryLabel', 'type', 'width', 'classes'],
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
  background-color: $color-very-light-grey;
  background-size: contain;
  background-position: center center;

  &[width="2"] {
    @include rect(2/1);
  }
  &[width="4"] {
    @include rect(4/1);
  }
  &.shadow {
    @include shadow;
  }
  > .labels {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    > .label {      
      padding: 0.25rem;
      background: white;
      font-size: 1.25rem;
      font-weight: bold;
    }
    > .secondary-label {
      padding: 0.25rem;
      background: white;
    }
  }

}
</style>
