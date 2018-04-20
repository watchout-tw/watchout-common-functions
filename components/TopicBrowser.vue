<template>
<div class="topic-browser form-field-many-inputs">
  <button class="input button toggle park" v-for="topic of internalTopics" :key="topic.id" :class="buttonClasses(topic.selected)" @click="isMutable ? toggle(topic.id, topic.selected) : false">{{ topic.title }}</button>
</div>
</template>

<script>
export default {
  props: ['limit', 'topics', 'selectedTopics', 'mutable'],
  data() {
    return {
      internalTopics: this.topics.map(topic => ({
        ...topic,
        selected: this.selectedTopics.includes(topic.id)
      }))
    }
  },
  computed: {
    isMutable() {
      return !(this.mutable === false)
    }
  },
  watch: {
    'selectedTopics': function() {
      this.internalTopics = this.topics.map(topic => ({
        ...topic,
        selected: this.selectedTopics.includes(topic.id)
      }))
    }
  },
  methods: {
    buttonClasses(selected) {
      var classes = []
      classes.push(this.isMutable ? 'mutable' : 'immutable')
      classes.push(selected ? 'active' : 'inactive')
      return classes
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
