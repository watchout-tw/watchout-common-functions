<template>
<div class="doc-header">
  <div class="title margin-top-bottom-8" :class="{ 'variable-font-size': variableFontSize }">
    <h1 :class="titleClasses" v-html="spacingOptimizer(doc.title)" />
  </div>
  <div class="description paragraphs margin-8" v-if="description" v-html="markdown(doc.description)"></div>
  <div v-for="type of authorTypes" :key="type.valuePlural" class="authors-container" :class="[type.valuePlural]" v-if="doc[type.valuePlural] && doc[type.valuePlural].length > 0">
    <div class="author-type section-title with-underline small"><span>{{ type.label }}</span></div>
    <div class="authors">
      <avatar v-for="(author, index) of doc[type.valuePlural]" :persona="cachedAuthorByPersona(author).personaObj" :show="['avatar', 'name']" :classes="['horizontal']" size="small" :link="true" :key="index" />
    </div>
  </div>
  <div class="dates secondary-text font-size-small margin-top-bottom-8">
    <div v-if="doc.publishedAt"><span>發佈時間</span><span class="full-width-punct thin-punct">：</span><span>{{ getDateTimeString(doc.publishedAt) }}</span></div>
    <div v-if="doc.contentUpdatedAt"><span>最後更新</span><span class="full-width-punct thin-punct">：</span><span>{{ getDateTimeString(doc.contentUpdatedAt) }}</span></div>
  </div>
</div>
</template>

<script>
import { knowsBunko, knowsFormatting, knowsMarkdown, knowsWatchout } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'

export default {
  mixins: [knowsBunko, knowsFormatting, knowsMarkdown, knowsWatchout],
  props: ['doc', 'variableFontSize', 'titleSize', 'description', 'cachedAuthors'],
  computed: {
    titleClasses() {
      let classes = []
      if(this.titleSize) {
        classes.push(this.titleSize)
      }
      if(classes.length < 1) {
        classes.push('medium')
      }
      return classes
    }
  },
  methods: {
    cachedAuthorByPersona(personaID) {
      return this.cachedAuthors ? this.cachedAuthors.find(author => author.persona === personaID) : null
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
