<template>
<div class="cover-image-browser">
  <div class="options">
    <div class="option" v-for="option of internalOptions" :key="option" :class="[isSelected(option) ? 'active' : '']" @click="toggleSelection(option)">
      <cover-image :url="option" :width="2" />
      <input type="checkbox" class="park" :checked="isSelected(option)" />
    </div>
  </div>
  <div class="actions">
    <submit-button :classes="['medium', 'park']" label='這些圖我都不愛' :state.sync='reloadButton.state' :message.sync='reloadButton.message' @click.native='reload'></submit-button>
  </div>
</div>
</template>

<script>
import * as STATES from '../lib/states'
import SubmitButton from './button/Submit'
import CoverImage from './CoverImage'

const coverImages = require('../data/cover-images.json')
const defaultOptions = JSON.parse(JSON.stringify(coverImages.paths))
const defaultLimit = 1
const defaultSize = 4

export default {
  props: ['limit', 'size', 'selectedOptions', 'options'],
  data() {
    return {
      internalOptions: [],
      reloadButton: {
        state: STATES.DEFAULT,
        message: null
      }
    }
  },
  computed: {
    internalLimit() {
      return typeof this.limit === 'number' ? this.limit : defaultLimit
    },
    internalSize() {
      return typeof this.size === 'number' ? this.size : defaultSize
    },
    allOptions() {
      return Array.isArray(this.options) ? this.options : defaultOptions
    }
  },
  mounted() {
    if(this.internalOptions.length <= 0) {
      this.init()
    }
  },
  methods: {
    getRandomIndices(size, range) {
      var indices = []
      while(indices.length < size) {
        var index = Math.floor(Math.random() * range)
        if (indices.indexOf(index) > -1) continue
        indices.push(index)
      }
      return indices
    },
    setInternalOptions() {
      const indices = this.getRandomIndices(this.internalSize, this.allOptions.length)
      this.internalOptions = indices.map(index => this.allOptions[index])
    },
    init() {
      this.setInternalOptions()
      this.clearSelection()
      this.toggleSelection(this.internalOptions[0])
    },
    reload() {
      if(this.reloadButton.state !== STATES.DEFAULT) {
        return
      }
      this.reloadButton.state = STATES.LOADING
      this.init()
      this.reloadButton.state = STATES.SUCCESS
      this.reloadButton.message = '那這些呢？'
    },
    toggleSelection(options) {
      if(!Array.isArray(options)) {
        options = [options]
      }
      for(var option of options) {
        if(this.isSelected(option)) {
          const index = this.selectedOptions.findIndex(selectedOption => selectedOption === option)
          this.selectedOptions.splice(index, 1)
        } else {
          if(this.selectedOptions.length >= this.internalLimit) {
            this.selectedOptions.shift()
          }
          this.selectedOptions.push(option)
        }
      }
      this.$emit('update:selectedOptions', this.selectedOptions)
    },
    clearSelection() {
      this.selectedOptions.splice(0, this.selectedOptions.length)
      this.$emit('update:selectedOptions', this.selectedOptions)
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
  $margin: 0.375rem;
  > .options {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    > .option {
      position: relative;
      flex-basis: calc(50% - #{$margin});
      margin: $margin 0;
      cursor: pointer;
      > .cover-image {
        opacity: 0.25;
      }
      &.active > .cover-image {
        opacity: 1;
      }
      > input[type="checkbox"] {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
      }
    }
  }
  > .actions {
    margin: $margin 0;
    text-align: center;
  }
}

</style>
