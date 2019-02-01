<template>
<div class="ghost-article">
  <div class="content">
    <template v-for="(section, index) of mobiledoc.sections">
      <!--<ghost-markup v-if="section[0] === 1" :key="index" :tag-name="section[1]" :markers="section[2]" :atoms="mobiledoc.atoms" :markups="mobiledoc.markups" />-->
      <ghost-card v-if="section[0] === 10" :card="mobiledoc.cards[section[1]]" :data="data" :key="index" />
    </template>
  </div>
  <div class="links" v-if="links && links.length > 0">
    <comp-collection :collection="{ title: '相關連結', items: links }" :data="data" />
  </div>
  <div class="footnotes" v-if="footnotes && footnotes.length > 0">
    <comp-collection :collection="{ title: '註解', items: footnotes }" :data="data" />
  </div>
  <div class="active-footnote" :class="{ show: showActiveFootnote }">
    <div class="content">{{ activeFootnote }}</div>
    <div class="close" @click="showActiveFootnote = false"></div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import GhostMarkup from 'watchout-common-functions/components/ghost/Markup'
import GhostCard from 'watchout-common-functions/components/ghost/Card'
import CompCollection from 'watchout-common-functions/components/comp/Collection'

export default {
  mixins: [knowsMarkdown],
  props: ['article', 'footnotes', 'links', 'references', 'data'],
  data() {
    let mobiledoc = JSON.parse(this.article.mobiledoc)
    return {
      mobiledoc,
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
        console.log(event.target)
        this.activeFootnoteAnchor = event.target
        this.activeFootnoteID = (id - 1)
        this.showActiveFootnote = true
      })
    })
  },
  components: {
    GhostMarkup,
    GhostCard,
    CompCollection
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.ghost-article {
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
    font-size: $font-size-small;
    padding: 1em;
    background-color: rgba($color-watchout, 0.95);
    @include shadow;
    &.show {
      top: auto;
      bottom: 1rem;
      transform: translateX(-50%);
    }
  }
}
</style>
