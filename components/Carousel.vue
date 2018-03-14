<template>
<div class="carousel">
  <div class="content">
    <div class="page">
      什麼是給問擂台？
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['config'],
  computed: {
    aspectRatio() {
      return this.config && this.config.hasOwnProperty('aspectRatio') ? this.config.aspectRatio : 16.0 / 9.0
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.carousel {
  position: relative;
  background-color: $color-very-light-grey;
  @include rect(2/1)
  @include tcl-md {
    @include rect(4/1)
  }
  > .content {
    > .page {
      width: 100%;
    }
  }
}
</style>
