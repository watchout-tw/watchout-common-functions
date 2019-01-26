<template>
<div class="doc-header responsive-typesetting-container margin-top-bottom-single">
  <div class="title variable-font-size margin-top-bottom-single">
    <h1 class="medium" v-html="spacingOptimizer(doc.title)" />
  </div>
  <div v-for="type of authorTypes" :key="type.valuePlural" class="authors-container" :class="[type.valuePlural]" v-if="doc[type.valuePlural]">
    <div class="author-type section-title with-underline small"><span>{{ type.label }}</span></div>
    <div class="authors">
      <avatar v-for="(author, index) of doc[type.valuePlural]" :persona="cachedAuthorByPersona(author).personaObj" :show="['avatar', 'name']" :classes="['horizontal']" size="small" :link="true" :key="author" />
    </div>
  </div>
  <div class="dates font-size-small margin-top-bottom-8">
    <div><span>發佈時間</span><span class="full-width-punctuation">：</span><span>{{ getDateTimeString(doc.publishedAt) }}</span></div>
    <div v-if="doc.updatedAt"><span>最後更新</span><span class="full-width-punctuation">：</span><span>{{ getDateTimeString(doc.updatedAt) }}</span></div>
  </div>
</div>
</template>

<script>
import { knowsBunko, knowsFormatting, knowsWatchout } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'

export default {
  mixins: [knowsBunko, knowsFormatting, knowsWatchout],
  props: ['doc', 'cachedAuthors'],
  methods: {
    cachedAuthorByPersona(personaID) {
      return this.cachedAuthors.find(author => author.persona === personaID)
    }
  },
  components: {
    Avatar
  }
}
</script>

<style lang="scss">
.doc-header {
  > .authors-container {
    display: flex;
    align-items: center;
    > .author-type {
      flex-shrink: 0;
    }
    > .authors {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
  }
}
</style>
