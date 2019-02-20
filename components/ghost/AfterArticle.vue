<template>
<div class="after-article">
  <div class="links" v-if="links && links.length > 0">
  <comp-collection :collection="{ title: '相關連結', items: links }" :data="data" />
</div>
<div class="footnotes" v-if="footnotes && footnotes.length > 0">
  <comp-collection :collection="{ title: '註解', items: footnotes }" :data="data" display="list" />
</div>
<div class="active-footnote" :class="{ show: showActiveFootnote }">
  <div class="content paragraphs no-margin a-text-parent" v-if="activeFootnote" v-html="markdown(activeFootnote.markdown)"></div>
  <div class="close" @click="showActiveFootnote = false"></div>
</div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import CompCollection from 'watchout-common-functions/components/comp/Collection'

export default {
  mixins: [knowsMarkdown],
  props: ['links', 'footnotes', 'references', 'data'],
  data() {
    return {
      showActiveFootnote: false,
      activeFootnoteAnchor: null,
      activeFootnoteID: -1
    }
  },
  computed: {
    activeFootnote() {
      return this.footnotes && this.activeFootnoteID > -1 ? this.footnotes[this.activeFootnoteID] : null
    }
  },
  mounted() {
    let footnoteAnchors = document.getElementsByClassName('footnote-anchor')
    Array.prototype.forEach.call(footnoteAnchors, (el) => {
      let id = parseInt(el.dataset.id)
      el.addEventListener('click', event => {
        this.activeFootnoteAnchor = event.target
        this.activeFootnoteID = (id - 1)
        this.showActiveFootnote = true
      })
    })
  },
  components: {
    CompCollection
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.after-article {
  > .active-footnote {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateY(100%) translateY(1rem) translateX(-50%);
    z-index: $z-tooltip;
    width: calc(100vw - 2rem);
    max-width: 24rem;
    transition-property: bottom, transform;
    transition-duration: 0.25s;
    padding: 1em;
    padding-top: 2em;
    font-size: $font-size-small;
    background-color: rgba($color-watchout-light-solid, 0.95);
    @include shadow;
    &.show {
      top: auto;
      bottom: 1rem;
      transform: translateX(-50%);
    }
  }
}
</style>
