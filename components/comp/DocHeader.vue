<template>
<div class="doc-header">
  <div class="title margin-top-bottom-8" :class="{ 'variable-font-size': variableFontSize }">
    <h1 :class="titleClasses" v-html="spacingOptimizer(getTitle)"></h1>
  </div>
  <div class="description paragraphs margin-8" v-if="description" v-html="markdown(getDescription)"></div>
  <div v-for="aType of filteredAuthorType" :key="aType.valuePlural" class="authors-container" :class="[aType.valuePlural]">
    <div class="author-type section-title with-underline small"><span>{{ getAuthorTypeLabel(aType) }}</span></div>
    <div class="authors">
      <avatar v-for="(author, index) of doc[aType.valuePlural]" :persona="cachedAuthorByPersona(author)" :show="['avatar', 'name']" :classes="['horizontal']" size="small" :link="false" :key="index" />
    </div>
  </div>
  <div class="dates secondary-text font-size-small margin-top-bottom-8">
    <div v-if="doc.publishedAt"><span>{{ publishedAtLabel }}</span><span class="full-width-punct thin-punct">：</span><span>{{ getDateTimeString(doc.publishedAt) }}</span></div>
    <div v-if="doc.contentUpdatedAt"><span>{{ contentUpdatedAtLabel }}</span><span class="full-width-punct thin-punct">：</span><span>{{ getDateTimeString(doc.contentUpdatedAt) }}</span></div>
  </div>
</div>
</template>

<script>
import { knowsBunko, knowsFormatting, knowsMarkdown, knowsWatchout } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'

// FIXME: workaround of i18n
const publishedAt = {
  label: '發佈時間',
  labelEN: 'Published At',
  labelTB: '發佈時間'
}

// FIXME: workaround of i18n
const contentUpdatedAt = {
  label: '最後更新',
  labelEN: 'Content Updated At',
  labelTB: '最後更新'
}

export default {
  mixins: [knowsBunko, knowsFormatting, knowsMarkdown, knowsWatchout],
  props: ['doc', 'variableFontSize', 'titleSize', 'description', 'cachedAuthors'],
  computed: {
    // FIXME: workaround of i18n
    language() {
      if(this.$router.currentRoute.path.substring(0, 3).includes('en')) {
        return 'EN'
      } else if(this.$router.currentRoute.path.substring(0, 3).includes('tb')) {
        return 'TB'
      } else {
        return ''
      }
    },
    titleClasses() {
      let classes = []
      if(this.titleSize) {
        classes.push(this.titleSize)
      }
      if(classes.length < 1) {
        classes.push('medium')
      }
      return classes
    },
    // FIXME: workaround of i18n
    getDescription() {
      return this.language && this.doc[`description${this.language}`] ? this.doc[`description${this.language}`] : this.doc.description
    },
    // FIXME: workaround of i18n
    getTitle() {
      return this.language && this.doc[`title${this.language}`] ? this.doc[`title${this.language}`] : this.doc.title
    },
    // FIXME: workaround of i18n
    publishedAtLabel() {
      return this.language && publishedAt[`label${this.language}`] ? publishedAt[`label${this.language}`] : publishedAt.label
    },
    // FIXME: workaround of i18n
    contentUpdatedAtLabel() {
      return this.language && contentUpdatedAt[`label${this.language}`] ? contentUpdatedAt[`label${this.language}`] : contentUpdatedAt.label
    },
    filteredAuthorType() {
      return this.authorTypes.filter(aType => this.doc[aType.valuePlural] && this.doc[aType.valuePlural].length > 0)
    }
  },
  methods: {
    cachedAuthorByPersona(personaID) {
      return this.cachedAuthors && this.cachedAuthors.find(author => author.id == personaID) ? this.cachedAuthors.find(author => author.id == personaID) : {}
    },
    // FIXME: workaround of i18n
    getAuthorTypeLabel(aType) {
      return this.language && aType[`label${this.language}`] ? aType[`label${this.language}`] : aType.label
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
