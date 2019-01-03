<template>
<div class="ghost-card">
  <div class="content" v-if="type === 'html'" v-html="content.html"></div>
  <div class="content" v-else-if="type === 'reference'">
    <component :is="content.type" :id="content.id" :data="data" />
  </div>
  <div class="content paragraphs a-text-parent" v-else-if="type === 'markdown'" v-html="markdown(content.markdown)"></div>
  <div class="content image-container document" v-else-if="type === 'image'">
    <img :src="'https://beta.bunko.watchout.tw' + content.src" :alt="content.caption" />
  </div>
  <div class="content" v-else-if="type === 'hr'">
    <div class="divider"></div>
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import { parseReference, parseCard } from 'watchout-common-functions/lib/bunko'
import Collection from 'watchout-common-functions/components/comp/Collection'
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
    Collection
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.ghost-card {
  > .content {
    > .card.default {
      padding: 1rem;
      width: 16rem;
      line-height: $line-height-default;
      background-color: $color-watchout-light;
      @include shadow;
      > .title {
        font-size: 1rem;
        line-height: $line-height-default;
      }
    }
    > .divider {
      margin: 2rem auto;
      max-width: 2rem;
      border-bottom: 2px solid $color-very-light-grey;
    }
  }
}
</style>
