<template>
<div class="carousel">
  <div class="content">
    <div class="pages" :id="scrollElementID">
      <div class="page" v-for="page of pages" :style="pageStyles(page)"></div>
    </div>
  </div>
  <div class="controls">
    <div class="control prev" @click="goToPage((currentPage + pages.length - 1) % pages.length)"></div>
    <div class="control next" @click="goToPage((currentPage + pages.length + 1) % pages.length)"></div>
  </div>
</div>
</template>

<script>
const genID = require('uuid/v4')
/* FIXME: Current assumptions

- A carousel sets its own size ONLY at DOM ready
- A carousel is 2-to-1 on smaller devices & 4-to-1 on larger decives with a 576px breakpoint

*/
export default {
  props: ['pages'],
  data() {
    return {
      bp: {
        sm: 576
      },
      currentPage: 0,
      scrollElementID: genID(),
      windowSize: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    scrollElement() {
      return document ? document.getElementById(this.scrollElementID) : null
    },
    scrollLeft() {
      return this.currentPage * this.scrollElement.offsetWidth // getBoundingClientRect().width
    }
  },
  watch: {
    currentPage() {
      if(this.scrollElement) {
        this.scrollElement.scrollLeft = this.scrollLeft
      }
    }
  },
  methods: {
    updateWindowSize() {
      if(window) {
        this.windowSize.height = window.innerHeight
        this.windowSize.width = window.innerWidth
      }
    },
    pageStyles(page) {
      var styles = {}
      if(page.type === 'image') {
        styles.backgroundImage = `url(${this.windowSize.width > this.bp.sm ? page.urls.wide : page.urls.default})`
      }
      return styles
    },
    goToPage(index) {
      this.currentPage = index
    }
  },
  mounted() {
    this.updateWindowSize()
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.carousel {
  position: relative;
  background-color: $color-very-light-grey;
  @include rect(2/1)
  @include tcl-md {
    @include rect(4/1)
  }
  > .content {
    > .pages {
      height: 100%;
      display: flex;
      overflow-x: auto;
      align-items: stretch;
      -webkit-overflow-scrolling: touch;
      > .page {
        flex-shrink: 0;
        width: 100%;
        background-size: cover;
        background-position: center center;
      }
    }
  }
  > .controls {
    position: absolute;
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    > .control {
      flex-grow: 1;
      cursor: pointer;
      &.prev {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:before {
          content: '◀︎';
          display: block;
          margin: 0 0.5rem;
          font-size: 1.5rem;
          opacity: 0.25;
        }
      }
      &.next {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        &:after {
          content: '▶︎';
          display: block;
          margin: 0 0.5rem;
          font-size: 1.5rem;
          opacity: 0.25;
        }
      }
    }
  }
}
</style>
