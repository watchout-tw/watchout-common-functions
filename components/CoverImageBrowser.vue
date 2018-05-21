<template>
<div class="cover-image-browser">
  <div class="options tcl-container">
    <div class="tcl-panel" v-for="option of internalOptions" :key="option">
      <cover-image :url="option" :classes="['option']" :width="4" @click.native="select(option)"></cover-image>
    </div>
  </div>
  <submit-button label='reload' :state.sync='reloading.state' :message.sync='reloading.message' @click.native='reload'></submit-button>
</div>
</template>

<script>
import * as STATES from '../lib/states'
import SubmitButton from './button/Submit'
import CoverImage from './CoverImage'

const defaultOptions = [
  'cover-images/1.png',
  'cover-images/2.png',
  'cover-images/3.png',
  'cover-images/4.png',
  'cover-images/5.png',
  'cover-images/6.png'
]
const defaultLimit = 1
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
  computed: {
    selectLimit() {
      return typeof this.limit === 'number' ? this.limit : defaultLimit
    }
  },
  mounted() {
    this.generateInternalOptions()

    // select default options
    const indexes = this.generateRandomIndexes(this.selectLimit, this.internalOptions.length)
    const options = indexes.map(index => this.internalOptions[index])
    this.select(options)
  },
  methods: {
    generateRandomIndexes(amount, range) {
      var indexes = []
      while(indexes.length < amount) {
        var index = Math.floor(Math.random() * range)
        if (indexes.indexOf(index) > -1) continue
        indexes.push(index)
      }
      return indexes
    },
    generateInternalOptions() {
      const options = Array.isArray(this.options) ? this.options : defaultOptions
      const indexes = this.generateRandomIndexes(optionsAmount, options.length)
      this.internalOptions = indexes.map(index => options[index])
    },
    reload() {
      if(this.reloading.state !== STATES.DEFAULT) return

      this.reloading.state = STATES.LOADING
      this.generateInternalOptions()
      this.reloading.state = STATES.SUCCESS
      this.reloading.message = 'reload成功'
    },
    select(options) {
      var newSelecteds = this.selectedOptions
      if(!Array.isArray(options)) options = [options]
      for(var option of options) {
        if(this.selectedOptions.indexOf(option) > -1) {
          const index = this.selectedOptions.findIndex(_option => _option === option)
          newSelecteds.splice(index, 1)
        } else {
          if(this.selectedOptions.length === this.selectLimit) return
          newSelecteds.push(option)
        }
      }
      this.$emit('update:selectedOptions', newSelecteds)
    }
  },
  components: {
    SubmitButton,
    CoverImage
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

</style>
