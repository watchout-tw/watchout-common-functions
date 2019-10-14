<template>
<div class="paging-container">
  <div class="controls form-field-many-inputs no-wrap form-field-align-center">
    <submit-button :classes="[channel]" class="medium" v-if="prevPageExists && showBoundary" label="1" :state.sync="allButtonStatuses.firstPage.state" :message.sync="allButtonStatuses.firstPage.message" @click.native="firstPage" />
    <submit-button class="medium disabled" v-else label="1" />
    <submit-button :classes="[channel]" class="medium" v-if="prevPageExists" :label="PUNCT.L.ARR" :state.sync="allButtonStatuses.prevPage.state" :message.sync="allButtonStatuses.prevPage.message" @click.native="prevPage" />
    <submit-button class="medium disabled" v-else :label="PUNCT.L.ARR" />
    <div class="current-page-string margin-right-left-4" v-html="spacingOptimizer(currentPageString)"></div>
    <submit-button :classes="[channel]" class="medium" v-if="nextPageExists" :label="PUNCT.R.ARR" :state.sync="allButtonStatuses.nextPage.state" :message.sync="allButtonStatuses.nextPage.message" @click.native="nextPage" />
    <submit-button class="medium disabled" v-else :label="PUNCT.R.ARR" />
    <submit-button :classes="[channel]" class="medium" v-if="nextPageExists && showBoundary" :label="PUNCT.R.ARRSTOP" :state.sync="allButtonStatuses.lastPage.state" :message.sync="allButtonStatuses.lastPage.message" @click.native="lastPage" />
    <submit-button class="medium disabled" v-else :label="PUNCT.R.ARRSTOP" />
  </div>
</div>
</template>

<script>
import * as STATES from 'watchout-common-functions/lib/states'
import { PUNCT } from 'watchout-common-functions/lib/bunko'
import { knowsBunko } from 'watchout-common-functions/interfaces'
import SubmitButton from 'watchout-common-functions/components/button/Submit'

export default {
  mixins: [knowsBunko],
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
    },
    channel: {
      type: String,
      default: 'watchout'
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
      },
      PUNCT
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
    },
    currentPageString() {
      return '第' + ' ' + this.currentPage + PUNCT.SLASH + this.totalPageCount + ' ' + '頁'
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
  }
}
</style>
