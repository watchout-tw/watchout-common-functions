<template>
<div class="topic-browser form-field-many-inputs">
  <button class="input button toggle park" v-for="topic of topics" :class="topic.selected ? 'active' : 'inactive'" @click="toggle(topic)">{{ topic.label }}</button>
</div>
</template>

<script>
var topics = ['教育', '性別', '勞工', '產業', '基礎建設', '環保', '開放政府']
topics = topics.map(topic => ({
  label: topic,
  selected: false
}))

export default {
  props: ['allowMultiple', 'selectedTopics'],
  data() {
    return {
      topics
    }
  },
  methods: {
    toggle(topic) {
      if(this.allowMultiple !== true) {
        this.topics.forEach(topic => {
          topic.selected = false
        })
      }
      topic.selected = !topic.selected
      this.$emit('update:selectedTopics', this.topics.filter(topic => topic.selected).map(topic => topic.label))
    }
  }
}
</script>
