<template>
<div class="progress-bar" :class="classes">
  <div class="bar" :style="barStyles"></div>
</div>
</template>

<script>
export default {
  props: ['p', 'q', 'classes'],
  computed: {
    percentage() {
      let value = (this.p ? this.p : 0) / (this.q ? this.q : 100) * 100.0
      return value > 100 ? 100 : value
    },
    barStyles() {
      return {
        width: this.percentage + '%'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.progress-bar {
  width: 100%;
  background-color: $color-very-light-grey;
  border-radius: 0.25rem;
  overflow: hidden;
  > .bar {
    height: 0.5rem;
    background-color: $color-watchout;
  }
  &.ask {
    > .bar {
      background-color: $color-ask;
    }
  }
  &.musou {
    > .bar {
      background-color: $color-musou;
    }
  }
}
</style>
