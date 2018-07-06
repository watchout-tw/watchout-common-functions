<template>
<div class="carousel" :class="internalClasses">
  <div class="content">
    <div class="pages" @scroll="onScroll">
      <component :is="page.hasOwnProperty('link') ? 'a' : 'div'" class="page" :href="page.link ? page.link.url : null" v-for="(page, index) of pages" :key="index" :style="pageStyles(page)">
          <video-player v-if="page.type === 'video'" :platform="page.platform" :id="page.id" :classes="[]" />
      </component>
    </div>
  </div>
  <template v-if="pages.length > 1">
    <div class="control prev" @click="goToPage((currentPage + pages.length - 1) % pages.length)"></div>
    <div class="control next" @click="goToPage((currentPage + pages.length + 1) % pages.length)"></div>
    <div class="dots">
      <div class="dot" v-for="(dot, index) of dots" :key="index" :class="[ ...(dot.isActive ? ['active'] : []), ...(dot.isStop ? ['stop'] : []) ]" @click="goToPage(index)"></div>
    </div>
  </template>
</div>
</template>

<script>
import VideoPlayer from './VideoPlayer'
const CLICK = 1
const SCROLL = 2

/* FIXME: Current assumptions

- A carousel sets its own size ONLY at DOM ready
- A carousel is of these sizes
  - default: 2-to-1 on smaller devices & 4-to-1 on larger decives with a 576px breakpoint
  - slides: 3-to-2 and non-responsive

*/
export default {
  props: ['responsive', 'pages', 'stops', 'width', 'height', 'classes'],
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
      },
      lastUserAction: null
    }
  },
  computed: {
    internalWidth() {
      return !Number.isNaN(parseInt(this.width)) ? parseInt(this.width) : 2
    },
    internalHeight() {
      return !Number.isNaN(parseInt(this.height)) ? parseInt(this.height) : 1
    },
    internalClasses() {
      let otherClasses = []
      if(this.pages.length > 1) {
        otherClasses.push('with-controls')
      }
      if(this.responsive) {
        otherClasses.push('responsive')
      }
      if(this.internalWidth === 3 && this.internalHeight === 2) {
        otherClasses.push('slides')
      } else if(this.internalWidth === 16 && this.internalHeight === 9) {
        otherClasses.push('video')
      } else {
        otherClasses.push('default')
      }
      return otherClasses.concat(Array.isArray(this.classes) ? this.classes : [])
    },
    pageWidth() {
      return this.scrollElement ? this.scrollElement.offsetWidth : 0
    },
    dots() {
      return this.pages.map((page, index) => ({
        type: 'default',
        isActive: index === this.currentPage,
        isStop: Array.isArray(this.stops) && this.stops.map(stop => stop.id).includes(page.id)
      }))
    }
  },
  watch: {
    currentPage() {
      if(this.scrollElement && this.lastUserAction !== SCROLL) {
        this.scrollElement.scrollLeft = this.currentPage * this.pageWidth
      }
    }
  },
  methods: {
    updateWindowSize() {
      if(process.browser && window) {
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
    goToPage(value) {
      let index = -1
      if(Number.isInteger(value)) {
        index = value
      } else {
        index = this.pages.findIndex(page => page.id === value)
      }
      if(index > -1) {
        this.currentPage = index
        this.lastUserAction = CLICK
      } else {
        this.lastUserAction = null
      }
    },
    onScroll() {
      if(this.scrollElement) {
        let scrollLeft = this.scrollElement.scrollLeft
        this.currentPage = Math.round(scrollLeft / this.pageWidth)
        this.lastUserAction = SCROLL
      } else {
        this.lastUserAction = null
      }
    }
  },
  mounted() {
    this.updateWindowSize()
    this.scrollElement = this.$el.querySelector('.pages')
  },
  components: {
    VideoPlayer
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.carousel {
  $dot-size: 0.5rem;
  position: relative;
  background-color: $color-very-light-grey;
  &.with-controls {
    margin-bottom: $dot-size * 5;
  }
  &.default {
    @include rect(2/1);
    &.responsive {
      @include tcl-md {
        @include rect(4/1);
      }
    }
  }
  &.immersive {
    @include rect(1);
    &.responsive {
      @include tcl-md {
        @include rect(2/1);
      }
    }
  }
  &.slides {
    @include rect(3/2);
  }
  &.video {
    @include rect(16/9);
  }
  &.shadow-lifted-darker {
    @include shadow-lifted-darker;
  }
  &.shadow-lifted-darkest {
    @include shadow-lifted-darkest;
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
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
  }
  > .control {
    position: absolute;
    top: 0;
    height: 100%;
    cursor: pointer;
    color: white;
    $text-shadow: 0 0 8px rgba(black, 0.25);
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
        opacity: 0.75;
        text-shadow: $text-shadow;
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
        opacity: 0.75;
        text-shadow: $text-shadow;
      }
    }
  }
  > .stops {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0.25rem 0;
  }
  > .dots {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: $dot-size / 2;
    display: flex;
    justify-content: center;

    > .dot {
      width: $dot-size * 2;
      height: $dot-size * 2;
      margin: 0 $dot-size / 4;
      opacity: 0.25;
      cursor: pointer;

      &:after {
        content: '';
        display: block;
        width: $dot-size;
        height: $dot-size;
        margin: $dot-size / 2;
        border-radius: 50%;
        background-color: black;
      }
      &.active {
        opacity: 1;
      }
      &.stop {
        &:after {
          width: $dot-size * 1.5;
          height: $dot-size * 1.5;
          margin: $dot-size / 4;
        }
      }
    }
  }
  &[class*=shadow] {
    > .dots {
      margin-top: $dot-size;
    }
  }
  &.on-dark-background {
    > .dots {
      > .dot {
        &:after {
          background-color: white;
        }
      }
    }
  }
}
</style>
