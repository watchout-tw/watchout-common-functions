<template>
<div class="submit-button button" :class="classes">
  <div v-if="state === STATES.DEFAULT" class="label">{{ label }}</div>
  <div v-else class="symbol-container" :style="symbolStyles">
    <div v-if="state === STATES.LOADING" class="symbol loading"></div>
    <div v-else-if="state === STATES.SUCCESS" class="symbol checkmark" ></div>
    <div v-else-if="state === STATES.FAILED" class="symbol cross"></div>
  </div>
  <div class="message-container" :style="messageStyles"><span ref="message">{{ message }}</span></div>
</div>
</template>

<script>
import * as STATES from '../../lib/states'
export default {
  props: ['classes', 'label', 'state', 'message'],
  data() {
    return {
      STATES,
      symbolOffsetX: 0,
      showMessage: false
    }
  },
  watch: {
    state() {
      // FIXME: this is hard coded
      const fontSize = 16
      const averageSymbolSize = 24
      const symbolAnimationDuration = 500
      setTimeout(() => {
        if(this.message) {
          // animate after symbolAnimation
          this.symbolOffsetX = (this.$refs.message.getBoundingClientRect().width + averageSymbolSize + fontSize) / 2 * -1
          this.showMessage = true
        }
        setTimeout(this.reset, 2500)
      }, symbolAnimationDuration)
    }
  },
  computed: {
    symbolStyles() {
      return {
        transform: `translateX(${this.symbolOffsetX}px)`
      }
    },
    messageStyles() {
      return {
        opacity: this.showMessage ? 1 : 0
      }
    }
  },
  methods: {
    reset() {
      this.symbolOffsetX = 0
      this.showMessage = false
      this.$emit('update:state', this.STATES.DEFAULT)
      this.$emit('update:message', null)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.submit-button {
  position: relative;
  text-align: center;
  $line-height: 1rem;
  min-width: 2.5rem;

  > .symbol-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.25s ease;
    > .symbol {

    }
    > .loading {
      @include spinner();
    }
    > .checkmark {
      @include checkmark-animated;
    }
    > .cross {
      @include cross-animated;
    }
  }

  > .message-container {
    opacity: 0;
    transition: opacity 0.5s ease;
    display: flex;
    justify-content: center;
  }
}
</style>
