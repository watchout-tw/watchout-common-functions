<template>
<div class="cover-image-browser">
  <div class="options" v-for="option of internalOptions">
    {{ option }}
  </div>
  <submit-button label='reload' :state.sync='reloading.state' :message.sync='reloading.message' @click.native='reload'></submit-button>
</div>
</template>

<script>
import SubmitButton from './button/Submit'
import * as STATES from '../lib/states'

const defaultOptions = [
  'watchout-common-assets/images/cover-images/1.jpeg',
  'watchout-common-assets/images/cover-images/2.jpeg',
  'watchout-common-assets/images/cover-images/3.jpeg',
  'watchout-common-assets/images/cover-images/4.jpeg',
  'watchout-common-assets/images/cover-images/5.jpg',
  'watchout-common-assets/images/cover-images/6.jpeg'
]
const optionsAmount = 4

export default {
  props: ['limit', 'selectedOptions', 'options'],
  data() {
    return {
      internalOptions: [],
      reloading: {
        state: STATES.DEFAULT,
        message: null
      }
    }
  },
  mounted() {
    this.generateOptions()
  },
  methods: {
    generateOptions() {
      const options = Array.isArray(this.options) ? this.options : defaultOptions
      var indexes = []
      while(indexes.length < optionsAmount) {
        var index = Math.floor(Math.random() * options.length)
        if (indexes.indexOf(index) > -1) continue
        indexes.push(index)
      }
      this.internalOptions = indexes.map(index => options[index])
    },
    reload() {
      if(this.reloading.state !== STATES.DEFAULT) return

      this.reloading.state = STATES.LOADING
      this.generateOptions()
      this.reloading.state = STATES.SUCCESS
      this.reloading.message = 'reload成功'
    }
  },
  components: {
    SubmitButton
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

</style>
