<template>
<div class="ghost-article" ref="article">
  <div class="content">
    <template v-for="(section, index) of sections">
      <ghost-card v-if="section[0] === 10" :card="cards[section[1]]" :data="data" :key="index" />
    </template>
  </div>
</div>
</template>

<script>
import { spacingOptimizer } from 'watchout-common-functions/lib/bunko'
import GhostCard from 'watchout-common-functions/components/ghost/Card'

export default {
  props: ['sections', 'cards', 'links', 'footnotes', 'references', 'data'],
  mounted() {
    // FIXME: spacing optimzation should be done in interfaces/knowsMarkdown.markdown()
    let headings = [...this.$refs.article.getElementsByTagName('h2'), ...this.$refs.article.getElementsByTagName('h3')]
    headings.forEach(heading => {
      heading.innerHTML = spacingOptimizer(heading.innerHTML)
    })
  },
  components: {
    GhostCard
  }
}
</script>
