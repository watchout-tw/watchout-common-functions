<template>
<div class="carousel" :class="responsive ? 'responsive' : ''">
  <div class="content">
    <div class="pages">
      <component :is="page.hasOwnProperty('link') ? 'a' : 'div'" class="page" :href="page.link ? page.link.url : null" v-for="page of pages" :key="JSON.stringify(page)" :style="pageStyles(page)"></component>
    </div>
  </div>
  <template v-if="pages.length > 1">
    <div class="control prev" @click="goToPage((currentPage + pages.length - 1) % pages.length)"></div>
    <div class="control next" @click="goToPage((currentPage + pages.length + 1) % pages.length)"></div>
  </template>
</div>
</template>

<script>
/* FIXME: Current assumptions

- A carousel sets its own size ONLY at DOM ready
- A carousel is 2-to-1 on smaller devices & 4-to-1 on larger decives with a 576px breakpoint

*/
export default {
  props: ['responsive', 'pages'],
  data() {
    return {
      bp: {
        sm: 576
      },
      currentPage: 0,
      scrollElement: null,
      windowSize: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    scrollLeft() {
      return this.scrollElement ? this.currentPage * this.scrollElement.offsetWidth : 0
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
        styles.backgroundImage = `url(${this.responsive && this.windowSize.width > this.bp.sm ? page.urls.wide : page.urls.default})`
      }
      return styles
    },
    goToPage(index) {
      this.currentPage = index
    }
  },
  mounted() {
    this.updateWindowSize()
    this.scrollElement = this.$el.querySelector('.pages')
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.carousel {
  position: relative;
  background-color: $color-very-light-grey;
  @include rect(2/1)
  &.responsive {
    @include tcl-md {
      @include rect(4/1)
    }
  }
  > .content {
    > .pages {
      height: 100%;
      display: flex;
      overflow-x: auto;
      align-items: stretch;
      -webkit-overflow-scrolling: touch;
      > .page {
        display: block;
        flex-shrink: 0;
        width: 100%;
        background-size: cover;
        background-position: center center;
      }
    }
  }
  > .control {
    position: absolute;
    top: 0;
    height: 100%;
    cursor: pointer;
    &.prev {
      left: 0;
      padding-right: 2rem;
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
      right: 0;
      padding-left: 2rem;
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
</style>
