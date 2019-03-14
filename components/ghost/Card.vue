<template>
<div class="ghost-card">
  <div class="card" :class="content.type" v-if="type === 'reference'">
    <div class="content">
      <comp-collection v-if="content.type === 'collection'" :id="content.id" :data="data" />
      <comp-infobox v-if="content.type === 'doc' && content.params && content.params.display === 'infobox'" :id="content.id" :data="data" title-style="multi-line" />
      <comp-video v-if="['video', 'youtube'].includes(content.type)" :reference="content" />
    </div>
  </div>
  <div class="card" v-else-if="type === 'note'">
    <div class="content comp-note paragraphs single heading-size-medium a-text-parent" v-html="markdown(preprocessedMarkdown)"></div>
  </div>
  <div class="card" v-else-if="type === 'excerpt'">
    <div class="content comp-excerpt paragraphs single responsive-typesetting-container variable-font-size heading-size-medium a-text-parent" v-html="markdown(preprocessedMarkdown)"></div>
  </div>
  <div class="card" v-else-if="type === 'markdown'">
    <div class="content paragraphs responsive-typesetting-container variable-font-size heading-size-medium a-text-parent" v-html="markdown(preprocessedMarkdown)"></div>
  </div>
  <div class="card image-container" v-else-if="type === 'image'">
    <img :src="content.reference.permalink" :alt="content.caption" />
    <div v-if="content.caption" class="caption paragraphs no-margin a-text-parent secondary-text tcl-left-right-margin margin-top-bottom-8" v-html="markdown(content.caption, true)"></div>
  </div>
  <div class="card" v-else-if="type === 'hr'">
    <div class="content comp-divider"></div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import CompCollection from 'watchout-common-functions/components/comp/Collection'
import CompInfobox from 'watchout-common-functions/components/comp/Infobox'
import CompVideo from 'watchout-common-functions/components/comp/Video'

export default {
  mixins: [knowsMarkdown],
  props: ['card', 'data'],
  computed: {
    type() {
      return this.card.type
    },
    content() {
      return this.card.content
    },
    preprocessedMarkdown() {
      return this.card.markdown
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
    > .comp-note {
      max-width: 32rem;
      margin: 2rem auto;
      padding: 1rem;
      background-color: $color-light-grey;
      font-size: $font-size-variable-default;
    }
    > .comp-excerpt {
      padding: 1em;
      background-color: $color-very-light-grey;
      @include shadow-expanded-soft;
    }
    > .comp-divider {
      margin: 2rem auto;
      max-width: 2rem;
      border-bottom: 2px solid $color-very-light-grey;
    }
  }
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
</style>
