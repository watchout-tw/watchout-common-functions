<template>
<div class="ghost-card">
  <div class="card" :class="content.type" v-if="type === 'reference'">
    <div class="content">
      <comp-collection v-if="content.type === 'collection'" :id="content.id" :data="data" />
      <comp-infobox v-if="content.type === 'doc' && content.params && content.params.display === 'infobox'" :id="content.id" :data="data" title-style="multi-line" />
      <comp-video v-if="['video', 'youtube'].includes(content.type)" :reference="content" />
    </div>
  </div>
  <div class="card" v-else-if="type === 'html'">
    <div class="content" v-html="content.html"></div>
  </div>
  <div class="card" v-else-if="type === 'note'">
    <div class="content note paragraphs heading-size-medium a-text-parent"  v-html="markdown(markdownPreprocessor(content))"></div>
  </div>
  <div class="card" v-else-if="type === 'markdown'">
    <div class="content paragraphs responsive-typesetting-container variable-font-size heading-size-medium a-text-parent"  v-html="markdown(markdownPreprocessor(content))"></div>
  </div>
  <div class="card image-container" v-else-if="type === 'image'">
    <img :src="'https://beta.bunko.watchout.tw' + content.src" :alt="content.caption" />
    <div v-if="content.caption" class="caption paragraphs no-margin a-text-parent secondary-text tcl-left-right-margin margin-top-bottom-8" v-html="markdown(content.caption, true)"></div>
  </div>
  <div class="card" v-else-if="type === 'hr'">
    <div class="content divider"></div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import { parseReference } from 'watchout-common-functions/lib/watchout'
import { parseCard } from 'watchout-common-functions/lib/bunko'
import CompCollection from 'watchout-common-functions/components/comp/Collection'
import CompInfobox from 'watchout-common-functions/components/comp/Infobox'
import CompVideo from 'watchout-common-functions/components/comp/Video'

export default {
  mixins: [knowsMarkdown],
  props: ['card', 'data'],
  computed: {
    type() {
      return parseCard(this.card).type
    },
    content() {
      return parseCard(this.card).content
    }
  },
  methods: {
    markdownPreprocessor(markdown) {
      let regExp = /[ ]*{{(.+?)}}[ ]*/g
      let codeObjects = []
      let match = regExp.exec(markdown)
      while(match) {
        codeObjects.push({
          code: match[1].trim(),
          matchLength: match[0].length,
          matchAt: match['index']
        })
        match = regExp.exec(markdown)
      }
      codeObjects.sort((a, b) => b.matchAt - a.matchAt)
      codeObjects.forEach(({ code, matchLength, matchAt }) => {
        let html = ''
        let ref = parseReference(code)
        if(ref.type === 'footnote') {
          html = `<label class="footnote-anchor" data-id="${ref.id}">${ref.id}</label>`
        }
        markdown = markdown.substring(0, matchAt) + html + markdown.substring(matchAt + matchLength)
      })
      return markdown
    }
  },
  components: {
    CompCollection,
    CompInfobox,
    CompVideo
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.ghost-card {
  > .card {
    > .note {
      max-width: 32rem;
      margin: 2rem auto;
      padding: 1rem;
      background-color: $color-light-grey;
      font-size: $font-size-variable-default;
    }
    > .divider {
      margin: 2rem auto;
      max-width: 2rem;
      border-bottom: 2px solid $color-very-light-grey;
    }
    > .content.variable-font-size {
      .footnote-anchor {
        display: inline-block;
        vertical-align: middle;
        font-size: 0.875rem;
        width: 1.875em;
        line-height: 1.875em;
        text-align: center;
        border-radius: 50%;
        margin: 0 0.25em;
        transform: translateY(-0.125rem);
        background-color: rgba($color-watchout, 0.85);
        cursor: pointer;
        @include shadow-reduced;
      }
    }
  }
}
</style>
