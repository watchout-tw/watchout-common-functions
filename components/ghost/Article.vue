<template>
<div class="ghost-article" ref="article">
  <div class="content">
    <template v-for="(section, index) of mobiledoc.sections">
      <!--<ghost-markup v-if="section[0] === 1" :key="index" :tag-name="section[1]" :markers="section[2]" :atoms="mobiledoc.atoms" :markups="mobiledoc.markups" />-->
      <ghost-card v-if="section[0] === 10" :card="mobiledoc.cards[section[1]]" :data="data" :key="index" />
    </template>
  </div>
</div>
</template>

<script>
import { spacingOptimizer } from 'watchout-common-functions/lib/bunko'
import GhostMarkup from 'watchout-common-functions/components/ghost/Markup'
import GhostCard from 'watchout-common-functions/components/ghost/Card'
import CompCollection from 'watchout-common-functions/components/comp/Collection'

export default {
  props: ['article', 'links', 'footnotes', 'references', 'data'],
  data() {
    let mobiledoc = JSON.parse(this.article.mobiledoc)
    return {
      mobiledoc
    }
  },
  mounted() {
    // FIXME: spacing optimzation should be done in interfaces/knowsMarkdown.markdown()
    let headings = [...this.$refs.article.getElementsByTagName('h2'), ...this.$refs.article.getElementsByTagName('h3')]
    headings.forEach(heading => {
      heading.innerHTML = spacingOptimizer(heading.innerHTML)
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

}
</style>
