<template>
<div class="cover-image-browser">
  <div class="options" v-for="option of internalOptions">
    {{ option }}
  </div>
</div>
</template>

<script>
const defaultOptions = [
  'watchout-common-assets/images/cover-images/1.jpeg',
  'watchout-common-assets/images/cover-images/2.jpeg',
  'watchout-common-assets/images/cover-images/3.jpeg',
  'watchout-common-assets/images/cover-images/4.jpeg',
  'watchout-common-assets/images/cover-images/5.jpg',
  'watchout-common-assets/images/cover-images/6.jpeg'
]
const optionsAmt = 4

export default {
  props: ['limit', 'selectedOptions', 'options'],
  data() {
    return {
      internalOptions: []
    }
  },
  mounted() {
    this.selectOptions()
  },
  methods: {
    selectOptions() {
      const options = Array.isArray(this.options) ? this.options : defaultOptions
      var indexes = []
      while(indexes.length < optionsAmt) {
        var index = Math.floor(Math.random() * options.length)
        if (indexes.indexOf(index) > -1) continue
        indexes.push(index)
      }
      this.internalOptions = indexes.map(index => options[index])
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

</style>
