<template>
<div class="paging-container">
  <div class="controls form-field-many-inputs form-field-align-center">
    <submit-button :classes="['ask', 'medium']" v-if="prevPageExists && showBoundary" label="第一頁" :state.sync="allButtonStatuses.firstPage.state" :message.sync="allButtonStatuses.firstPage.message" @click.native="firstPage" />
    <submit-button :classes="['ask', 'medium']" v-if="prevPageExists" label="上一頁" :state.sync="allButtonStatuses.prevPage.state" :message.sync="allButtonStatuses.prevPage.message" @click.native="prevPage" />
    <div class="current-state">
      <span class="font-size-tiny">第</span>
      <span class="latin-within-han">{{ currentPage }}</span>
      <span class="latin-within-han">/</span>
      <span class="latin-within-han">{{ totalPageCount }}</span>
      <span class="font-size-tiny">頁</span>
    </div>
    <submit-button :classes="['ask', 'medium']" v-if="nextPageExists" label="下一頁" :state.sync="allButtonStatuses.nextPage.state" :message.sync="allButtonStatuses.nextPage.message" @click.native="nextPage" />
    <submit-button :classes="['ask', 'medium']" v-if="nextPageExists && showBoundary" label="最末頁" :state.sync="allButtonStatuses.lastPage.state" :message.sync="allButtonStatuses.lastPage.message" @click.native="lastPage" />
  </div>
</div>
</template>

<script>
import * as STATES from '../lib/states'
import SubmitButton from './button/Submit'

export default {
  props: {
    totalItems: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 20
    },
    boundaryLinks: {
      type: Boolean,
      default: true
    },
    currentButtonStatus: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      buttonClicked: '',
      allButtonStatuses: {
        firstPage: { state: STATES.DEFAULT, message: null, success: '更新成功', failed: '更新失敗' },
        prevPage: { state: STATES.DEFAULT, message: null, success: '更新成功', failed: '更新失敗' },
        nextPage: { state: STATES.DEFAULT, message: null, success: '更新成功', failed: '更新失敗' },
        lastPage: { state: STATES.DEFAULT, message: null, success: '更新成功', failed: '更新失敗' }
      }
    }
  },
  watch: {
    'currentButtonStatus.state'(next, prev) {
      if(this.buttonClicked === '') {
        return
      }
      this.allButtonStatuses[this.buttonClicked].state = next
      if(next === STATES.SUCCESS) {
        this.allButtonStatuses[this.buttonClicked].message = this.allButtonStatuses[this.buttonClicked].success
      } else if(next === STATES.FAILED) {
        this.allButtonStatuses[this.buttonClicked].message = this.allButtonStatuses[this.buttonClicked].failed
      }
    }
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
    },
    showBoundary() {
      return this.boundaryLinks
    }
  },
  methods: {
    firstPage() {
      if(this.currentPage <= 1) {
        return
      }
      this.buttonClicked = 'firstPage'
      this.$emit('update:currentPage', 1)
    },
    nextPage() {
      this.buttonClicked = 'nextPage'
      this.$emit('update:currentPage', this.currentPage + 1)
    },
    prevPage() {
      if(this.currentPage <= 1) {
        return
      }
      this.buttonClicked = 'prevPage'
      this.$emit('update:currentPage', this.currentPage - 1)
    },
    lastPage() {
      this.buttonClicked = 'lastPage'
      this.$emit('update:currentPage', Math.ceil(this.totalItems / this.pageSize))
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
