<template>
<div class="before-article responsive-typesetting-container margin-top-bottom-single">
  <div class="title variable-font-size margin-top-bottom-single">
    <h1 class="medium">{{ doc.title }}</h1>
  </div>
  <div class="authors">
    <template v-for="(author, index) of doc.authors">
      <a class="author a-text" :href="getParkPersonaProfileURL(author)">{{ cachedAuthorByPersona(author).name }}</a>
      <span v-if="index < doc.authors.length - 1">、</span>
    </template>
  </div>
  <div class="dates font-size-small">
    <div><span>發佈時間</span><span class="full-width-punctuation">：</span><span>{{ getDateTimeString(doc.publishedAt) }}</span></div>
    <div v-if="doc.updatedAt"><span>最後更新</span><span class="full-width-punctuation">：</span><span>{{ getDateTimeString(doc.updatedAt) }}</span></div>
  </div>
</div>
</template>

<script>
import { knowsFormatting, knowsWatchout } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsFormatting, knowsWatchout],
  props: ['doc', 'cachedAuthors'],
  methods: {
    cachedAuthorByPersona(personaID) {
      return this.cachedAuthors.find(author => author.persona === personaID)
    }
  }
}
</script>
