<template>
<div class="topic-browser form-field-many-inputs">
  <button class="input button toggle park" v-for="topic of internalTopics" :key="topic.id" :class="buttonClasses(topic.selected)" @click="isMutable ? toggle(topic.id) : false">{{ topic.title }}</button>
</div>
</template>

<script>
export default {
  props: ['allowMultiple', 'topics', 'selectedTopics', 'mutable'],
  data() {
    console.warn('sele', this.selectedTopics)
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
    'selectedTopics.length': function() {
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
    toggle(topicID) {
      if(this.allowMultiple !== true) {
        this.internalTopics.forEach(topic => {
          topic.selected = false
        })
      }
      let topic = this.internalTopics.find(topic => topic.id === topicID)
      topic.selected = !topic.selected
      this.$emit('update:selectedTopics', this.internalTopics.filter(topic => topic.selected).map(topic => topic.id))
    }
  }
}
</script>
