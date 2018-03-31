<template>
<div class="topic-browser form-field-many-inputs">
  <button class="input button toggle park" v-for="topic of topicSet" :class="topic.selected ? 'active' : 'inactive'" @click="toggle(topic)">{{ topic.title }}</button>
</div>
</template>

<script>
export default {
  props: ['allowMultiple', 'topics', 'selectedTopics'],
  beforeMount () {
    this.init()
  },
  data () {
    return {
      topicSet: []
    }
  },
  methods: {
    init () {
      this.topicSet = this.topics.map(topic => ({
        ...topic,
        selected: false
      }))
    },
    toggle(topic) {
      if(this.allowMultiple !== true) {
        this.topicSet.forEach(topic => {
          topic.selected = false
        })
      }
      topic.selected = !topic.selected
      this.$emit('update:selectedTopics', this.topicSet.filter(topic => topic.selected).map(topic => topic.title))
    }
  }
}
</script>
