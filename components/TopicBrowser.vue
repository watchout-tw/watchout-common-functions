<template>
<div class="topic-browser">
  <div class="filtered-keywords" v-if="internalShowFilteredKeywords">
    <div class="keywords">
      <span class="keyword secondary-text font-size-small" v-for="keyword in filteredKeywords">{{ keyword }}</span>
    </div>
  </div>
  <div class="topics" v-if="showTopics !== false">
    <button type="button" class="topic input button small toggle" v-for="topic of internalTopics" :key="topic.id" :class="buttonClasses(topic.selected)" @click="isMutable ? toggle(topic.id, topic.selected) : false">{{ topicText(topic) }}</button>
  </div>
  <a class="toggle-ignore-filter-text font-size-small a-text" v-if="showTopics !== false && filterText && filterText != ''" @click.prevent="toggleIgnoreFilterText">{{ ignoreFilterText ? '啟用關鍵字過濾' : '顯示所有議題' }}</a>
  <div class="selected-topic-keywords" v-if="internalShowSelectedTopicKeywords">
    <div class="section-title with-underline small margin-top-bottom-4" ><span>熱門關鍵字</span></div>
    <div class="keywords" v-if="internalShowSelectedTopicKeywords">
      <span class="keyword secondary-text font-size-small" v-for="keyword in selectedTopicKeywords">{{ keyword }}</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['limit', 'types', 'topics', 'selectedTopics', 'mutable', 'filterText', 'showTopics', 'showKeywords', 'showSelectedTopicKeywords'],
  data() {
    return {
      internalTopics: this.generateInternalTopics(),
      ignoreFilterText: false,
      filteredKeywords: [],
      selectedTopicKeywords: []
    }
  },
  computed: {
    isMutable() {
      return !(this.mutable === false)
    },
    customTopicClasses() {
      return this.buttonClasses(this.customTopicSelected)
    },
    internalShowFilteredKeywords() {
      return this.filteredKeywords.length > 0 && this.showKeywords !== false
    },
    internalShowSelectedTopicKeywords() {
      return this.selectedTopicKeywords.length > 0 && this.showSelectedTopicKeywords !== false
    }
  },
  watch: {
    'selectedTopics'() {
      this.internalTopics = this.generateInternalTopics()
    },
    'filterText'() {
      this.internalTopics = this.generateInternalTopics()
    },
    'ignoreFilterText'() {
      this.internalTopics = this.generateInternalTopics()
    }
  },
  methods: {
    getSelectedTopics() {
      return this.topics.filter(topic => this.types.includes(topic.type)).map(topic => ({
        ...topic,
        selected: this.selectedTopics ? this.selectedTopics.includes(topic.id) : false
      }))
    },
    generateInternalTopics() {
      this.filteredKeywords = []
      var filteredTopics = this.getSelectedTopics().filter(topic => {
        let flag
        if(this.ignoreFilterText) {
          return true
        } else if(!topic.data.keywords) {
          flag = false
        } else if(!this.filterText) {
          flag = true
        } else {
          flag = topic.data.keywords.filter(word => {
            if(word.includes(this.filterText)) {
              this.filteredKeywords.push(word)
              return true
            } else {
              return false
            }
          }).length > 0
        }
        return flag
      })
      if(filteredTopics.length === 0) {
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
      if(this.limit && this.selectedTopics.length >= this.limit) {
        this.selectedTopics.shift()
      }
      if(isSelected) {
        this.selectedTopics.splice(this.selectedTopics.indexOf(topicID), 1)
      } else {
        this.selectedTopics.push(topicID)
      }
      this.selectedTopicKeywords = [].concat(...this.selectedTopics.map(topicID => {
        let topic = this.internalTopics.filter(topic => topic.id === topicID).pop()
        return (topic && topic.data && topic.data.keywords) ? topic.data.keywords : []
      }))
    },
    toggleIgnoreFilterText() {
      this.ignoreFilterText = !this.ignoreFilterText
    }
  }
}
</script>

<style lang="scss">
.topic-browser {
  .keywords {
    > .keyword {
      display: inline-block;
      padding-right: 1em;
    }
  }
  > .topics {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    $margin: 0.375rem;
    margin-left: -$margin;
    margin-right: -$margin;
    > .topic {
      width: auto;
      flex-basis: auto;
      margin: $margin;
    }
  }
}

</style>
