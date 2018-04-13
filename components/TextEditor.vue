<template>
<div class="text-editor" :class="computedClasses">
  <div class="tools"></div>
  <div class="content">
    <component :is="inputElement" rows="4" ref="inputElement" :placeholder="placeholder" :value="content" @input="updateContent()" @focus="isFocused = true" @blur="isFocused = false" :maxlength="maxlength"></component>
  </div>
</div>
</template>

<script>
export default {
  props: ['simple', 'placeholder', 'content', 'maxlength', 'classes'],
  data() {
    return {
      isFocused: false
    }
  },
  computed: {
    inputElement() {
      return this.simple ? 'input' : 'textarea'
    },
    computedClasses() {
      let moreClasses = []
      if(this.simple) {
        moreClasses.push('simple')
      }
      if(this.isFocused) {
        moreClasses.push('focused')
      }
      return Array.isArray(this.classes) ? this.classes.concat(...moreClasses) : moreClasses
    }
  },
  methods: {
    updateContent() {
      this.$emit('input', this.$refs.inputElement.value)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.text-editor {
  border-style: solid;
  border-color: $color-light-border-grey;
  border-radius: 1px;
  &.simple {
    border-width: 0;
    border-bottom-width: 1px;
  }
  &:not(.simple) {
    border-width: 1px;
  }
  &.focused {
    background-color: $color-watchout-very-light;
    border-color: $color-watchout;
    &.ask {
      border-color: $color-ask;
    }
    &.park {
      border-color: $color-park;
    }
  }
  > .content {
    > input {
      display: block;
      width: 100%;
      border: none;
      background: none;
      padding: 0.25rem 0.375rem;
    }
    > textarea {
      display: block;
      width: 100%;
      border: none;
      padding: 0.25rem 0.375rem;
      line-height: $line-height-default;
      background: none;
    }
  }
}
</style>
