<template>
<div class="share-button" :class="classes"></div>
</template>

<script>
export default {
  props: ['classes']
}
</script>

<style lang="scss">
.share-button {
  width: 2.25rem;
  height: 2.25rem;
  background-image: url('~watchout-common-assets/images/generic-component/share.png');
  background-size: contain;
  cursor: pointer;

  &.top-right {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
