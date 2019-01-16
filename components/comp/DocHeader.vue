<template>
<div class="doc-header responsive-typesetting-container margin-top-bottom-single">
  <div class="title variable-font-size margin-top-bottom-single">
    <h1 class="medium">{{ doc.title }}</h1>
  </div>
  <div class="authors">
    <avatar v-for="(author, index) of doc.authors" :persona="cachedAuthorByPersona(author).personaObj" :show="['avatar', 'name']" :classes="['horizontal']" size="small" :link="true" :key="author" />
  </div>
  <div class="dates font-size-small">
    <div><span>發佈時間</span><span class="full-width-punctuation">：</span><span>{{ getDateTimeString(doc.publishedAt) }}</span></div>
    <div v-if="doc.updatedAt"><span>最後更新</span><span class="full-width-punctuation">：</span><span>{{ getDateTimeString(doc.updatedAt) }}</span></div>
  </div>
</div>
</template>

<script>
import { knowsFormatting, knowsWatchout } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'

export default {
  mixins: [knowsFormatting, knowsWatchout],
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
  > .authors {
    display: flex;
  }
}
</style>
