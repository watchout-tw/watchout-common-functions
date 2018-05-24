<template>
<div class="topic-browser">
  <div v-if="userKeywords.length > 0 && showKeywords">
    <span class="keyword" v-for="keyword in userKeywords">#{{ keyword }}</span>
  </div>
  <div class="form-field-many-inputs form-field-align-center">
    <button class="input button medium toggle" v-for="topic of internalTopics" :key="topic.id" :class="buttonClasses(topic.selected)" @click="isMutable ? toggle(topic.id, topic.selected) : false">{{ topicText(topic) }}</button>
  </div>
</div>
</template>

<script>
export default {
  props: ['limit', 'topics', 'selectedTopics', 'mutable', 'filterText', 'showKeywords'],
  data() {
    return {
      internalTopics: this.generateInternalTopics(),
      userKeywords: []
    }
  },
  computed: {
    isMutable() {
      return !(this.mutable === false)
    },
    customTopicClasses() {
      return this.buttonClasses(this.customTopicSelected)
    }
  },
  watch: {
    'selectedTopics': function () {
      this.internalTopics = this.generateInternalTopics()
    },
    'filterText': function () {
      this.internalTopics = this.generateInternalTopics()
    }
  },
  methods: {
    getSelectedTopics () {
      return this.topics.map(topic => ({
        ...topic,
        selected: this.selectedTopics ? this.selectedTopics.includes(topic.id) : false
      }))
    },
    generateInternalTopics() {
      this.userKeywords = []
      var filteredTopics = this.getSelectedTopics().filter(topic => {
        if (!topic.data.keywords) return false
        if (!this.filterText) return true
        return topic.data.keywords.some(word => {
          if (word.includes(this.filterText)) {
            this.userKeywords.push(word)
            return true
          }
          return false
        })
      })
      if (filteredTopics.length === 0) {
        filteredTopics = this.getSelectedTopics().filter(topic => {
          return topic.slug === 'other'
        })
      }
      return filteredTopics
    },
    buttonClasses(selected) {
      var classes = []
      classes.push(this.topics[0].hasOwnProperty('battlefield') ? 'ask' : 'park') // FIXME: quick hack
      classes.push(this.isMutable ? 'mutable' : 'immutable')
      classes.push(selected ? 'active' : 'inactive')
      return classes
    },
    topicText(topic) {
      return topic.hasOwnProperty('battlefield') ? (topic.year + topic.title) : topic.title
    },
    toggle(topicID, isSelected) {
      if (this.limit && this.selectedTopics.length >= this.limit) {
        this.selectedTopics.shift()
      }
      if (isSelected) {
        this.selectedTopics.splice(this.selectedTopics.indexOf(topicID), 1)
      } else {
        this.selectedTopics.push(topicID)
      }
    }
  }
}
</script>

<style lang="scss">
.topic-browser {
  margin: 0.5rem 0;
}
.keyword {
  padding-right: 0.3rem
}
</style>
