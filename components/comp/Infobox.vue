<template>
<div class="comp-infobox margin-top-bottom-single">
  <div class="content">
    <h4>{{ doc.title }}</h4>
    <div class="content font-size-small">
      <div class="card" v-for="(section, index) of mobiledoc.sections" :key="index" v-if="section[0] === 10 && mobiledoc.cards[section[1]][0] === 'markdown'">
        <div class="paragraphs last" v-html="markdown(mobiledoc.cards[section[1]][1].markdown)"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import { makeReference } from 'watchout-common-functions/lib/bunko'

export default {
  mixins: [knowsMarkdown],
  props: ['id', 'data'],
  computed: {
    reference() {
      return makeReference('doc', this.id)
    },
    doc() {
      return this.data ? this.data[this.reference] : null
    },
    mobiledoc() {
      return JSON.parse(this.doc.content.mobiledoc)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-infobox {
  > .content {
    padding: 0.5rem 0.75rem;
    background-color: $color-very-very-light-grey;
    @include shadow;
  }
}
</style>
