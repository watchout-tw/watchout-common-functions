<template>
<div class="comp-infobox">
  <div class="infobox" :class="classes">
    <template v-if="titleStyle === 'spread-out'">
      <h3 class="title text-align-center">{{ doc.title }}</h3>
    </template>
    <template v-else-if="display !== 'minimal'">
      <h4 class="title section-title with-underline text-align-center" :class="{ 'multi-line': titleStyle === 'multi-line' }"><span>{{ doc.title }}</span></h4>
    </template>
    <template v-else>
      <h4 class="title text-align-center">{{ doc.title }}</h4>
    </template>
    <div class="content">
      <div class="card" v-for="(section, index) of mobiledoc.sections" :key="index" v-if="index < maxNumSection && section[0] === 10"><!-- && section[0] === 10 && mobiledoc.cards[section[1]][0] === 'markdown'">-->
        <template v-if="mobiledoc.cards[section[1]][0] === 'markdown'">
          <div class="paragraphs no-margin a-text-parent" v-html="markdown(mobiledoc.cards[section[1]][1].markdown)"></div>
        </template>
        <template v-else-if="mobiledoc.cards[section[1]][0] === 'image'">
          <img :src="'https://beta.bunko.watchout.tw' + mobiledoc.cards[section[1]][1].src" />
        </template>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import { makeReference } from 'watchout-common-functions/lib/watchout'

export default {
  mixins: [knowsMarkdown],
  props: ['id', 'data', 'display', 'horizontalSpace', 'titleStyle', 'headingStyle'],
  data() {
    return {
      maxNumSection: 2
    }
  },
  computed: {
    referenceObj() {
      return makeReference('doc', this.id)
    },
    doc() {
      return this.data ? this.data[this.referenceObj.url] : null
    },
    mobiledoc() {
      return JSON.parse(this.doc.content.mobiledoc)
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
    padding: 1rem 1.25rem;
    &:not(.minimal) {
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
          max-width: 16rem;
          margin: 1rem auto;
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
              margin: 0.5em 0 0.25em;
              text-align: center;
              font-size: 2em;
            }
          }
        }
      }
    }
  }
}
</style>
