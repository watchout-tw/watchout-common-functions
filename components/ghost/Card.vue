<template>
<div class="ghost-card">
  <div class="content" v-if="type === 'html'" v-html="content.html"></div>
  <div class="content paragraphs a-text-parent" v-else-if="type === 'markdown'" v-html="markdown(content.markdown)"></div>
  <div class="content image-container document" v-else-if="type === 'image'">
    <img :src="'https://beta.bunko.watchout.tw' + content.src" :alt="content.caption" />
  </div>
</div>
</template>

<script>
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
export default {
  mixins: [knowsMarkdown],
  props: ['card'],
  computed: {
    type() {
      return this.card[0]
    },
    content() {
      return this.card[1]
    }
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
  }
}
</style>
