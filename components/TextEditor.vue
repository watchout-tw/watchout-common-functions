<template>
<div class="text-editor input" :class="internalClasses">
  <div class="tools"></div>
  <div class="content">
    <div class="prefix secondary-text" v-if="simple && prefix">{{ prefix }}</div>
    <input v-if="simple" :type="internalType" :value="value" :maxlength="maxlength" ref="inputElement" :placeholder="placeholder" :disabled="disabled" @input="$emit('input', $event.target.value)" @focus="isFocused = true" @blur="isFocused = false" size="4" /><!-- size is a hack here -->
    <textarea v-else rows="4" :maxlength="maxlength" :value="value" ref="inputElement" :placeholder="placeholder" :disabled="disabled" @input="$emit('input', $event.target.value)" @focus="isFocused = true" @blur="isFocused = false"></textarea>
  </div>
</div>
</template>

<script>
export default {
  props: ['placeholder', 'type', 'value', 'disabled', 'classes', 'simple', 'maxlength', 'prefix'],
  data() {
    return {
      isFocused: false
    }
  },
  computed: {
    internalType() {
      return this.type ? this.type : 'text'
    },
    internalClasses() {
      let classes = Array.isArray(this.classes) ? this.classes.slice() : []
      if(this.simple) {
        classes.push('simple')
      }
      if(this.isFocused) {
        classes.push('focused')
      }
      classes = [...new Set(classes)]
      classes.sort()
      return classes
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
      background-color: $color-ask-very-light;
      border-color: $color-ask;
    }
    &.park {
      background-color: $color-park-very-light;
      border-color: $color-park;
    }
    &.dark {
      background-color: $color-light-grey;
      border-color: $color-anti-nuclear;
    }
  }
  &.small {
    font-size: $font-size-small;
  }
  &.tiny {
    font-size: $font-size-tiny;
  }
  > .content {
    display: flex;
    align-items: baseline;
    > .prefix {
      flex-grow: 0;
    }
    > input {
      display: block;
      width: 100%;
      min-width: auto;
      border: none;
      background: none;
      padding: 0.25rem 0.375rem;
      line-height: $line-height-compact;
      &:hover {
        line-height: $line-height-compact;
      }
    }
    > .prefix + input {
      padding-left: 0;
    }
    > textarea {
      display: block;
      width: 100%;
      border: none;
      padding: 0.25rem 0.375rem;
      background: none;
      line-height: $line-height-compact;
      &:hover {
        line-height: $line-height-compact;
      }
    }
  }
  &.font-monospace {
    > .content {
      > input,
      > textarea {
        @include font-monospace;
      }
    }
  }
}
</style>
