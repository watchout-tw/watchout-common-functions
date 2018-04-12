<template>
<div class="submit-button button" :class="classes">
  <div v-if="state === STATES.LOADING" class="loading"></div>
  <div v-else-if="state === STATES.SUCCESS" class="success">
    <div class="checkmark"></div>
  </div>
  <div v-else-if="state === STATES.FAILED" class="failed">
    <div class="cross"></div>
  </div>
  <div v-else class="text">{{ displayText }}</div>
</div>
</template>

<script>
import * as STATES from '../../lib/states'
export default {
  props: ['classes', 'label', 'state'],
  data() {
    return {
      STATES
    }
  },
  computed: {
    displayText() {
      return this.label
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.submit-button {
  position: relative;
  > .text {
    text-align: center;
  }
  > .loading {
    @include spinner;
  }
  > .success,
  > .failed {
    display: flex;
    justify-content: center;
  }
  > .success {
    > .checkmark {
      @include checkmark-animated;
    }
  }
  > .failed {
    > .cross {
      @include cross-animated;
    }
  }
}
</style>
