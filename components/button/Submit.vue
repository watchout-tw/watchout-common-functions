<template>
<button class="submit-button input button" :class="internalClasses" :type="internalType">
  <div v-if="!state || state === STATES.DEFAULT" class="label">{{ label }}</div>
  <div v-else class="symbol-container" :style="symbolStyles">
    <div v-if="state === STATES.LOADING" class="symbol loading"></div>
    <div v-else-if="state === STATES.SUCCESS" class="symbol checkmark"></div>
    <div v-else-if="[STATES.FAILED, STATES.INCOMPLETE].includes(state)" class="symbol cross"></div>
  </div>
  <div v-if="message" class="message-container" :style="messageStyles"><span ref="message">{{ message }}</span></div>
</button>
</template>

<script>
import * as STATES from 'watchout-common-functions/lib/states'

const DEFAULT_FONT_SIZE = 16
const DEFAULT_SYMBOL_SIZE = DEFAULT_FONT_SIZE * 1.5

export default {
  props: ['type', 'classes', 'label', 'state', 'message', 'once'],
  data() {
    return {
      STATES,
      symbolOffsetX: 0,
      showMessage: false,
      isFullWidth: false,
      fontSize: DEFAULT_FONT_SIZE,
      symbolSize: DEFAULT_SYMBOL_SIZE,
      symbolAnimationDuration: 500, // FIXME: this is hard coded
      finalizeAfter: 2000, // FIXME: this is hard coded
      hasBeenDone: false
    }
  },
  computed: {
    internalType() {
      return this.type ? this.type : 'button'
    },
    internalClasses() {
      return (Array.isArray(this.classes) ? this.classes : []).concat(this.once === true && this.hasBeenDone === true ? ['immutable'] : [])
    },
    symbolStyles() {
      return {
        transform: `translateX(${this.symbolOffsetX}px) scale(${this.symbolSize / DEFAULT_SYMBOL_SIZE})`
      }
    },
    messageStyles() {
      return {
        opacity: this.showMessage ? 1 : 0,
        marginLeft: `${this.symbolSize + this.fontSize / 4}px`
      }
    }
  },
  watch: {
    state(nextState, prevState) {
      setTimeout(() => {
        if(this.message) {
          // animate after symbolAnimation
          this.isFullWidth = window.getComputedStyle(this.$el).flexGrow === '1'
          let messageWidth = this.$refs.message.getBoundingClientRect().width
          this.symbolOffsetX = (messageWidth / 2 + this.fontSize / 4) * -1
          this.showMessage = true
        }
        if(nextState === STATES.SUCCESS) {
          this.hasBeenDone = true
        }
        setTimeout(this.finalize, this.finalizeAfter)
      }, this.symbolAnimationDuration)
    }
  },
  mounted() {
    this.fontSize = parseInt(window.getComputedStyle(this.$el).fontSize)
    this.symbolSize = this.fontSize * 1.5
  },
  methods: {
    reset() {
      this.symbolOffsetX = 0
      this.showMessage = false
      if(this.state !== STATES.DEFAULT) {
        this.$emit('update:state', STATES.DEFAULT)
      }
      if(this.message !== null) {
        this.$emit('update:message', null)
      }
    },
    finalize() {
      if(this.state === STATES.SUCCESS) {
        if(!this.once) {
          this.reset()
        }
        this.$emit('success')
      } else if([STATES.FAILED, STATES.INCOMPLETE].includes(this.state)) {
        this.reset()
        this.$emit('failed') // TODO: failed & incomplete might need separate events
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.submit-button {
  position: relative;
  text-align: center;
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
    transform-origin: center center;
    > .symbol {
    }
    > .loading {
      @include spinner;
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
    transition: opacity 0.5s ease, padding 0.5 ease;
    display: flex;
    justify-content: center;
  }
}
</style>
