<template>
<div class="gender-slider input">
  <input type="range" min="-100" max="100" step="1" v-model="model" @change="push" />
  <div class="track">
    <div class="nob" :style="{ left: `${position}%` }"></div>
  </div>
  <div class="label">{{ label }}</div>
</div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      model: this.value ? this.value : 0
    }
  },
  watch: {
    'value'() {
      this.pull()
    }
  },
  computed: {
    position() {
      return (parseInt(this.model) + 100) / 2
    },
    percentage() {
      return Math.abs(parseInt(this.model)) + '%'
    },
    label() {
      return parseInt(this.model) === 0 ? '酷兒' : this.percentage + (this.model > 0 ? '男性' : '女性')
    }
  },
  methods: {
    pull() {
      this.model = this.value ? this.value : 0
    },
    push() {
      this.$emit('update:value', this.model)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.gender-slider {
  $track-height: 0.125rem;
  $nob-size: 1.5rem;
  $input-height: $nob-size * 1;
  text-align: center;
  position: relative;
  margin: 0 $nob-size / 2;

  > input {
    position: relative;
    opacity: 0;
    width: 100%;
    height: $input-height;
    z-index: 2;
  }
  > .track {
    position: absolute;
    top: $input-height / 2;
    left: 0;
    width: 100%;
    height: $track-height;
    background-color: $color-border-grey;
    z-index: 1;
    > .nob {
      position: absolute;
      top: - $nob-size / 2;
      width: $nob-size;
      height: $nob-size;
      border-radius: $nob-size;
      background-color: $color-park;
      transform: translateX(-50%);
      @include shadow;
    }
  }
}
</style>
