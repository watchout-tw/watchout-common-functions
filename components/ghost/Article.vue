<template>
<div class="ghost-article center-self with-left-right-margin">
  <h1 class="title small">{{ article.title }}</h1>
  <div class="doc">
    <template v-for="(section, index) of doc.sections">
      <ghost-markup v-if="section[0] === 1" :key="index" :tag-name="section[1]" :markers="section[2]" :atoms="doc.atoms" :markups="doc.markups" />
      <ghost-card v-if="section[0] === 10" :key="index" :card="doc.cards[section[1]]" />
    </template>
  </div>
  <!--<div class="content a-text-parent" v-html="content"></div>-->
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import GhostMarkup from 'watchout-common-functions/components/ghost/Markup'
import GhostCard from 'watchout-common-functions/components/ghost/Card'

export default {
  mixins: [knowsMarkdown],
  props: ['article'],
  computed: {
    doc() {
      return JSON.parse(this.article.mobiledoc)
    }
    /*
    content() {
      let card = JSON.parse(this.article.mobiledoc).cards[0][1] // Ghost 1.x
      let content = card.markdown
      return this.markdown(content)
        .replace(/<p><img(.*)src="(.*)"(.*)alt="(.*)"(.*)><\/p>/g, '<div class="image-container document"><img src="//bunko.watchout.tw$2" alt="$4" /></div>')
    }
    */
  },
  components: {
    GhostMarkup,
    GhostCard
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

$left-brace: '【';
$right-brace: '】';

.ghost-article {
  > .title {
    margin: 2rem 0 1rem;
  }
  > .content {
    .time {
      font-size: 0.875rem;
      color: $color-nice-grey;
    }
    .appendix-index {
      margin-top: 2rem;
    }
    .appendix-link {
      font-size: 0.875rem;
      &:before {
        content: $left-brace;
      }
      &:after {
        content: $right-brace;
      }
    }
  }
}
</style>
