<template>
<div class="comp-infobox">
  <div class="infobox" :class="classes">
    <template v-if="titleStyle === 'spaced-out'">
      <h3 class="title text-align-center">{{ doc.title }}</h3>
    </template>
    <template v-else>
      <h4 class="title section-title with-underline text-align-center"><span>{{ doc.title }}</span></h4>
    </template>
    <div class="content">
      <div class="card" v-for="(section, index) of mobiledoc.sections" :key="index" v-if="index < maxNumSection && section[0] === 10"><!-- && section[0] === 10 && mobiledoc.cards[section[1]][0] === 'markdown'">-->
        <template v-if="mobiledoc.cards[section[1]][0] === 'markdown'">
          <div class="paragraphs no-margin" v-html="markdown(mobiledoc.cards[section[1]][1].markdown)"></div>
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
  props: ['id', 'data', 'display', 'titleStyle'],
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
      if(this.display.match(/^flyer/)) {
        classes.push('flyer')
        if(this.display.includes('free-form')) {
          classes.push('free-form')
        }
      }
      // title style
      if(this.titleStyle === 'spaced-out') {
        classes.push('title-spaced-out')
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
    background-color: $color-very-very-light-grey;
    &.flyer {
      max-width: 20rem;
      padding: 1.5rem 1.75rem;
      margin: 1.5rem auto;
      background-color: white;
      @include shadow-expanded-soft;
      &.title-spaced-out > .title {
        margin-left: 0.375rem;
        font-size: 1.75rem;
        letter-spacing: 0.375em;
      }
    }
    &.free-form {
      max-width: none;
    }
    > .title {
      margin-bottom: 1rem;
    }
    > .content {
      > .card {
        > img {
          max-width: 220px;
          margin: 1rem auto;
        }
      }
    }
  }
}
</style>
