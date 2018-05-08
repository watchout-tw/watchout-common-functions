<template>
  <div class="review-buttons form-field-many-inputs">
    <button class="input button text-color-white" :classes="score.classes" v-for="score in scores" @click="review(score.value)">{{score.value}}</button>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import * as core from '../../lib/core'

const scores = [
  { value: 1, classes: [] },
  { value: 2, classes: [] },
  { value: 3, classes: [] },
  { value: 4, classes: [] },
  { value: 5, classes: [] }
]

export default {
  props: ['answer'],
  data () {
    return {
      scores: scores
    }
  },
  methods: {
    review (val) {
      this.$emit('review', val)
    },
    reviewAnswer: debounce(function () {
      if (!this.selectedScore) return
      core.reviewAnswer(this.answer.id).then(response => {
        this.$emit('reviewed')
      }).catch(error => {
        console.error(error)
      })
    })
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
</style>
