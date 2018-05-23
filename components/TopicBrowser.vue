<template>
<div class="topic-browser form-field-many-inputs form-field-align-center">
  <button class="input button medium toggle" v-for="topic of internalTopics" :key="topic.id" :class="buttonClasses(topic.selected)" @click="isMutable ? toggle(topic.id, topic.selected) : false">{{ topicText(topic) }}</button>
</div>
</template>

<script>
export default {
  props: ['limit', 'selectedTopics', 'topics', 'mutable'],
  data() {
    return {
      internalTopics: this.generateInternalTopics()
    }
  },
  computed: {
    isMutable() {
      return !(this.mutable === false)
    }
  },
  watch: {
    'selectedTopics': function() {
      this.internalTopics = this.generateInternalTopics()
    }
  },
  methods: {
    generateInternalTopics() {
      return this.topics.map(topic => ({
        ...topic,
        selected: this.selectedTopics ? this.selectedTopics.includes(topic.id) : false
      }))
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
      if(this.limit && this.selectedTopics.length >= this.limit) {
        this.selectedTopics.shift()
      }
      if(isSelected) {
        this.selectedTopics.splice(this.selectedTopics.indexOf(topicID), 1)
      }else {
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
</style>
