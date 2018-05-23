<template>
<div class="cover-image-browser">
  <div class="options tcl-container">
    <div v-for="option of internalOptions" :key="option" :class="['tcl-panel', isSelected(option) ? 'active' : '']">
      <cover-image :url="option" :width="4" @click.native="select(option)"></cover-image>
    </div>
  </div>
  <submit-button label='reload' :state.sync='reloading.state' :message.sync='reloading.message' @click.native='reload'></submit-button>
</div>
</template>

<script>
import * as STATES from '../lib/states'
import SubmitButton from './button/Submit'
import CoverImage from './CoverImage'

const defaultLimit = 1
const defaultAmount = 4

export default {
  props: ['limit', 'amount', 'selectedOptions', 'options'],
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
    },
    optionsAmount() {
      return typeof this.amount === 'number' ? this.amount : defaultAmount
    },
    _options() { // naming...
      if(Array.isArray(this.options)) return this.options
      var options = require('../data/cover-images.json')
      return JSON.parse(JSON.stringify(options)).paths
    }
  },
  mounted() {
    this.setInternalOptions()

    // select default options
    const indexes = this.getRandomIndexes(this.selectLimit, this.internalOptions.length)
    const options = indexes.map(index => this.internalOptions[index])
    this.select(options)
  },
  methods: {
    getRandomIndexes(amount, range) {
      var indexes = []
      while(indexes.length < amount) {
        var index = Math.floor(Math.random() * range)
        if (indexes.indexOf(index) > -1) continue
        indexes.push(index)
      }
      return indexes
    },
    setInternalOptions() {
      const indexes = this.getRandomIndexes(this.optionsAmount, this._options.length)
      this.internalOptions = indexes.map(index => this._options[index])
    },
    reload() {
      if(this.reloading.state !== STATES.DEFAULT) return

      this.reloading.state = STATES.LOADING
      this.setInternalOptions()
      this.reloading.state = STATES.SUCCESS
      this.reloading.message = 'reload成功'
    },
    select(options) {
      var newSelecteds = this.selectedOptions
      if(!Array.isArray(options)) options = [options]
      for(var option of options) {
        if(this.isSelected(option)) {
          const index = this.selectedOptions.findIndex(_option => _option === option)
          newSelecteds.splice(index, 1)
        } else {
          if(this.selectedOptions.length === this.selectLimit) return
          newSelecteds.push(option)
        }
      }
      this.$emit('update:selectedOptions', newSelecteds)
    },
    isSelected(option) {
      return this.selectedOptions.indexOf(option) > -1
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

.cover-image-browser {
  > .options {
    > .active {
      border: 1px solid black; //TODO
    }
  }
}

</style>
