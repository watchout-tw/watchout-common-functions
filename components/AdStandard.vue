<template>
<div class="ad standard">
  <div class="content" v-if="data">
    <div class="heading section-title-underline-tiny text-align-center"><span>廣告</span></div>
  </div>
</div>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.ad.standard {
  > .content {
    @include rect(4/1);
    border: 2px $color-very-light-grey solid;
    border-radius: 1px;
    > .heading {
      margin: 0.25rem 0;
    }
  }
}
</style>
