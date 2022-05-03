<template>
<div class="comp-infobox">
  <div class="infobox" :class="classes">
    <template v-if="titleStyle === 'spread-out'">
      <h3 class="title text-align-center" v-html="spacingOptimizer(title)"></h3>
    </template>
    <template v-else-if="display !== 'minimal'">
      <h4 class="title section-title with-underline text-align-center" :class="{ 'multi-line': titleStyle === 'multi-line' }"><span v-html="spacingOptimizer(title)"></span></h4>
    </template>
    <template v-else>
      <h4 class="title text-align-center" v-html="spacingOptimizer(title)"></h4>
    </template>
    <div class="content">
      <div class="card" v-for="(section, index) of mobiledocSections" :key="index">
        <template v-if="mobiledocCards[section[1]][0] === 'markdown'">
          <div class="paragraphs no-margin a-text-parent heading-size-medium" v-html="markdown(mobiledocCards[section[1]][1].markdown)"></div>
        </template>
        <template v-else-if="mobiledoc.cards[section[1]][0] === 'image'">
          <img :src="ghostBaseURL + mobiledocCards[section[1]][1].src" />
        </template>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import config from 'watchout-common-functions/config/config'
import { knowsBunko, knowsMarkdown } from 'watchout-common-functions/interfaces'
import { makeReference } from 'watchout-common-functions/lib/watchout'

export default {
  mixins: [knowsBunko, knowsMarkdown],
  props: ['id', 'data', 'display', 'horizontalSpace', 'titleStyle', 'headingStyle'],
  data() {
    return {
      ghostBaseURL: config.ghostBaseURL
    }
  },
  computed: {
    referenceObj() {
      return makeReference('doc', this.id)
    },
    doc() {
      return this.data ? this.data[this.referenceObj.url] : null
    },
    title() {
      return this.doc ? this.doc.title : null
    },
    mobiledocCards() {
      if(this.doc && this.doc.content) {
        let mobiledoc = JSON.parse(this.doc.content.mobiledoc)
        return mobiledoc.cards
      } else {
        return {}
      }
    },
    mobiledocSections() {
      if(this.doc && this.doc.content) {
        let mobiledoc = JSON.parse(this.doc.content.mobiledoc)
        return mobiledoc.sections.filter(section => section[0] === 10) // mobile 的格式判斷，只顯示文字 + 圖片
      } else {
        return []
      }
    },
    classes() {
      let classes = []
      // display
      if(this.display) {
        classes.push(this.display)
      }
      // horizontal spacing
      if(this.horizontalSpace === 'full-width') {
        classes.push('full-width')
      }
      // title style
      if(this.titleStyle === 'spread-out') {
        classes.push('title-spread-out')
      }
      // heading style
      if(this.headingStyle === 'emphasized') {
        classes.push('heading-emphasized')
      }
      return classes
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-infobox {
  > .infobox {
    max-width: 22rem;
    margin: 0 auto;
    &:not(.minimal) {
      padding: 1rem 1.25rem;
      background-color: $color-very-very-light-grey;
    }

    > .title {
      margin-bottom: 1rem;
      &.multi-line {
        margin-left: 1rem; // FIXME: quick hack
        margin-right: 1rem;
      }
    }
    > .content {
      > .card {
        > img {
          max-width: 100%;
          margin: 1rem auto;
        }
        > .paragraphs {
          > h2, > h3, > h4{
            margin-top: 0.5em;
            margin-bottom: 0.25em;
          }
        }
      }
    }
    &.flyer {
      max-width: 20rem;
      padding: 1.5rem 1.75rem;
      margin: 1.5rem auto;
      background-color: white;
      @include shadow-expanded-soft;
    }
    &.full-width {
      max-width: none;
    }
    &.title-spread-out {
      > .title {
        margin-left: 0.375rem;
        font-size: 1.75rem;
        letter-spacing: 0.375em;
      }
    }
    &.heading-emphasized {
      > .content {
        > .card {
          > .paragraphs {
            > h2 {
              font-size: 2em;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
