<template>
<div class="paging-container">
  <div class="controls form-field-many-inputs form-field-align-center">
    <submit-button :classes="['ask', 'medium']" v-if="prevPageExists" label="第一頁" @click.native="firstPage" />
    <submit-button :classes="['ask', 'medium']" v-if="prevPageExists" label="上一頁" @click.native="prevPage" />
    <div class="current-state">
      <span class="font-size-tiny">第</span>
      <span class="latin-within-han">{{ currentPage }}</span>
      <span class="latin-within-han">/</span>
      <span class="latin-within-han">{{ totalPageCount }}</span>
      <span class="font-size-tiny">頁</span>
    </div>
    <submit-button :classes="['ask', 'medium']" v-if="nextPageExists" label="下一頁" @click.native="nextPage" />
  </div>
</div>
</template>

<script>
import SubmitButton from './button/Submit'

export default {
  props: ['totalItems', 'currentPage', 'pageSize'],
  data () {
    return {}
  },
  computed: {
    totalPageCount() {
      return Math.ceil(this.totalItems / this.pageSize)
    },
    prevPageExists() {
      return this.currentPage > 1
    },
    nextPageExists() {
      return this.currentPage * this.pageSize < this.totalItems
    }
  },
  methods: {
    firstPage() {
      if(this.currentPage <= 1) {
        return
      }
      this.$emit('update:currentPage', 1)
    },
    nextPage() {
      this.$emit('update:currentPage', this.currentPage + 1)
    },
    prevPage() {
      if(this.currentPage <= 1) {
        return
      }
      this.$emit('update:currentPage', this.currentPage - 1)
    }
  },
  components: {
    SubmitButton
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.paging-container {
  > .controls {
    > .current-state {
      margin: 0 0.25rem;
    }
  }
}
</style>