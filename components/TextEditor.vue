<template>
<div class="text-editor">
  <div class="tools"></div>
  <div class="content">
    <textarea :placeholder="placeholder"></textarea>
  </div>
</div>
</template>

<script>
export default {
  props: ['placeholder']
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.text-editor {
  border: 2px $color-border-grey solid;
  border-radius: 1px;
  > .content {
    > textarea {
      display: block;
      width: 100%;
      border: none;
      padding: 0.25rem 0.375rem;
      line-height: $line-height-default;
    }
  }
}
</style>
