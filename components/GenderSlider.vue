<template>
<div class="gender-slider input">
  <div class="track-container">
    <div class="track"></div>
    <div class="hints secondary-text font-size-tiny">
      <div class="hint" v-for="(hint, index) of hints" :style="getPosition(hint.value)" :key="index">
        <div class="dot"></div>
        <div class="label">{{ hint.label }}</div>
      </div>
      <div class="hint queer"><div class="dot"></div></div>
    </div>
  </div>
  <input id="genderRange" type="range" min="-100" max="100" step="1" v-model="model" @change="push" />
  <div class="nob-container">
    <div class="nob" :style="getPositionFromLeft(model)"></div>
  </div>
  <div class="label"><span v-if="percentage !== 0" class="latin-within-han first">{{ Math.abs(percentage) }}%</span><span>{{ label }}</span></div>
</div>
</template>

<script>
let hints = [
  {
    value: 100,
    label: '男性'
  },
  {
    value: -100,
    label: '女性'
  }
]
export default {
  props: ['value', 'disabled'],
  data() {
    return {
      hints,
      model: this.value ? this.value : 0
    }
  },
  watch: {
    'value'() {
      this.pull()
    }
  },
  computed: {
    percentage() {
      return parseInt(this.model)
    },
    label() {
      return this.percentage === 0 ? '酷兒' : (this.percentage > 0 ? '男性' : '女性')
    }
  },
  methods: {
    getPositionFromLeft(val) {
      return {
        left: ((parseInt(val) + 100) / 2) + '%'
      }
    },
    getPosition(val) {
      let from = 'left'
      let pos = ((parseInt(val) + 100) / 2)
      if(pos > 50) {
        from = 'right'
        pos = 100 - pos
      }
      return {
        [from]: pos + '%',
        transform: 'translateX(' + (from === 'left' ? '-' : '+') + '50%)'
      }
    },
    pull() {
      this.model = this.value ? this.value : 0
    },
    push() {
      this.$emit('update:value', this.model)
    }
  },
  mounted() {
    if(!!this.disabled && JSON.parse(this.disabled.toLowerCase())) {
      document.getElementById('genderRange').disabled = true
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.gender-slider {
  $track-height: 0.125rem;
  $track-color: $color-border-grey;
  $nob-size: 1.5rem;
  $input-height: $nob-size * 1;
  $hint-dot-size: 0.75rem;

  text-align: center;
  position: relative;
  margin: 0 $nob-size / 2;
  > .track-container {
    height: $input-height;
    > .track {
      position: absolute;
      top: ($input-height - $track-height) / 2;
      left: 0;
      width: 100%;
      height: $track-height;
      background-color: $track-color;
    }
    > .hints {
      position: absolute;
      width: 100%;
      > .hint {
        position: absolute;
        > .dot {
          width: $hint-dot-size;
          height: $hint-dot-size;
          border-radius: 50%;
          margin: #{($input-height - $hint-dot-size) / 2} auto;
          background-color: $track-color;
        }
      }
      > .hint.queer {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        > .dot {
          $color-rainbow-red: #EF606A;
          $color-rainbow-orange: #F4B456;
          $color-rainbow-yellow: #F9E341;
          $color-rainbow-green: #41EF5E;
          $color-rainbow-blue: #6BBCF9;
          $color-rainbow-purple: #B66CEF;
          background: linear-gradient(
            180deg,
            $color-rainbow-red 0%,
            $color-rainbow-red 16.6667%,
            $color-rainbow-orange 16.6667%,
            $color-rainbow-orange 33.3333%,
            $color-rainbow-yellow 33.3333%,
            $color-rainbow-yellow 50%,
            $color-rainbow-green 50%,
            $color-rainbow-green 66.6667%,
            $color-rainbow-blue 66.6667%,
            $color-rainbow-blue 83.3333%,
            $color-rainbow-purple 83.3333%,
            $color-rainbow-purple 100%
          );
        }
      }
    }
  }
  > input {
    &:disabled{
      cursor: default;
    }
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: $input-height;
    z-index: 2;
    cursor: pointer;
  }
  > .nob-container {
    position: absolute;
    top: ($input-height - $track-height) / 2;
    left: 0;
    width: 100%;
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
