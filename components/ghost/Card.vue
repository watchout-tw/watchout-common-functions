<template>
<div class="ghost-card">
  <div class="card" v-if="type === 'reference'">
    <div class="content">
      <comp-collection v-if="content.type === 'collection'" :id="content.id" :data="data" />
      <comp-infobox v-if="content.type === 'doc' && content.params && content.params.display === 'infobox'" :id="content.id" :data="data" />
    </div>
  </div>
  <div class="card" v-else-if="type === 'html'">
    <div class="content" v-html="content.html"></div>
  </div>
  <div class="card" v-else-if="type === 'markdown'">
    <div class="content paragraphs responsive-typesetting-container variable-font-size heading-size-medium a-text-parent"  v-html="markdown(content.markdown)"></div>
  </div>
  <div class="card image-container" v-else-if="type === 'image'">
    <img :src="'https://beta.bunko.watchout.tw' + content.src" :alt="content.caption" />
  </div>
  <div class="card" v-else-if="type === 'hr'">
    <div class="content divider"></div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import { parseReference, parseCard } from 'watchout-common-functions/lib/bunko'
import CompCollection from 'watchout-common-functions/components/comp/Collection'
import CompInfobox from 'watchout-common-functions/components/comp/Infobox'

export default {
  mixins: [knowsMarkdown],
  props: ['card', 'data'],
  computed: {
    type() {
      return parseCard(this.card).type
    },
    content() {
      let content = parseCard(this.card).content
      if(this.type === 'reference') {
        content = parseReference(content)
      }
      return content
    }
  },
  components: {
    CompCollection,
    CompInfobox
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.ghost-card {
  > .card {
    > .divider {
      margin: 2rem auto;
      max-width: 2rem;
      border-bottom: 2px solid $color-very-light-grey;
    }
  }
}
</style>
