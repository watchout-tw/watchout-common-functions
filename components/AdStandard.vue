<template>
<div class="ad standard">
  <div class="content">
    <div class="heading section-title-underline-tiny text-align-center"><span>廣告</span></div>
  </div>
</div>
</template>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.ad.standard {
  @include rect(4/1);
  border: 2px $color-very-light-grey solid;
  border-radius: 1px;
  > .content {
    > .heading {
      margin: 0.25rem 0;
    }
  }
}
</style>
