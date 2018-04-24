<template>
<div class="drop-down-select input">
  <div class="triangle"></div>
  <div class="placeholder" v-if="!value">{{ placeholder }}</div>
  <select ref="inputElement" v-model="selectedItem" @input="$emit('input', $event.target.value)">
    <option disabled selected></option>
    <option v-for="option of options" :key="option.value" :value="typeof option !== 'object' ? option : option.value">{{ typeof option !== 'object' ? option : option.label }}</option>
  </select>
</div>
</template>

<script>
export default {
  props: ['options', 'placeholder', 'value'],
  data() {
    return {
      selectedItem: ''
    }
  },
  watch: {
    'value' () {
      this.selectedItem = this.value
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.drop-down-select {
  position: relative;
  border-bottom: 1px solid $color-light-border-grey;
  > select {
    appearance: none;
    width: 100%;
    border: none;
    padding: 0.25rem 0.375rem;
    line-height: $line-height-compact;
    background: none;
  }
  > .triangle {
    position: absolute;
    top: 0.25rem;
    right: 0;
    @include triangleDown;
    z-index: -1;
  }
  > .placeholder {
    position: absolute;
    top: 0.25rem;
    left: 0.375rem;
    color: $color-secondary-text-grey;
    z-index: -1;
  }
}
</style>
