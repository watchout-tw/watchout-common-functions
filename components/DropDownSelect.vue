<template>
<div class="drop-down-select input">
  <div class="triangle"></div>
  <div class="placeholder" v-if="!value && !internalValue">{{ placeholder }}</div>
  <select ref="inputElement" v-model="internalValue" @input="$emit('input', $event.target.value)">
    <option disabled selected></option>
    <option v-for="(option, index) of internalOptions" :value="option.value" :key="index">{{ option.label }}</option>
  </select>
</div>
</template>

<script>
export default {
  props: ['placeholder', 'options', 'value'],
  data() {
    return {
      internalValue: null
    }
  },
  computed: {
    internalOptions() {
      let options = this.options
      if(Array.isArray(this.options)) {
        options = this.options.map(option => {
          return typeof option === 'object' ? option : { value: option, label: option }
        })
      }
      return options
    }
  },
  beforeMount() {
    this.internalValue = this.value
  },
  watch: {
    value() {
      this.internalValue = this.value
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.drop-down-select {
  position: relative;
  border-bottom: 1px solid $color-light-border-grey;
  z-index: 0;
  > select {
    appearance: none;
    width: 100%;
    border: none;
    padding: 0.25rem 1rem 0.25rem 0.375rem;
    line-height: $line-height-compact;
    background: none;
  }
  > .triangle {
    position: absolute;
    top: 0.25rem;
    right: 0;
    z-index: -1;

    &:before {
      content: '';
      @include triangleDown;
    }
  }
  > .placeholder {
    position: absolute;
    top: 0.25rem;
    left: 0.375rem;
    color: $color-secondary-text-grey;
    z-index: -1;
  }
  &.small {
    font-size: 0.875rem;
  }
}
</style>
