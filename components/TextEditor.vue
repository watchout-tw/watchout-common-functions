<template>
<div class="text-editor">
  <div class="tools"></div>
  <div class="content">
    <textarea rows="4" ref="contentInput" :placeholder="placeholder" :value="content" @input="updateContent()" :maxlength="maxlength"></textarea>
  </div>
</div>
</template>

<script>
export default {
  props: ['placeholder', 'content', 'maxlength'],
  methods: {
    updateContent () {
      const text = this.$refs.contentInput.value
      this.$emit('input', text)
    }
  }
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
