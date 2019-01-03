<template>
<div class="ghost-article center-self with-left-right-margin">
  <h1 class="title small">{{ article.title }}</h1>
  <div class="doc">
    <template v-for="(section, index) of doc.sections">
      <ghost-markup v-if="section[0] === 1" :key="index" :tag-name="section[1]" :markers="section[2]" :atoms="doc.atoms" :markups="doc.markups" />
      <ghost-card v-else-if="section[0] === 10" :key="index" :card="doc.cards[section[1]]" :data="data" />
    </template>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import GhostMarkup from 'watchout-common-functions/components/ghost/Markup'
import GhostCard from 'watchout-common-functions/components/ghost/Card'

export default {
  mixins: [knowsMarkdown],
  props: ['article', 'data'],
  computed: {
    doc() {
      return JSON.parse(this.article.mobiledoc)
    }
  },
  components: {
    GhostMarkup,
    GhostCard
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.ghost-article {
  > .title {
    margin: 2rem 0 1rem;
  }
}
</style>
