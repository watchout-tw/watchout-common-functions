<template>
<div class="topic-browser">
  <div class="filtered-keywords" v-if="internalShowKeywords">
    <div class="keywords">
      <span class="keyword secondary-text font-size-small" v-for="keyword in internalTK.keywords" :key="keyword">{{ keyword }}</span>
    </div>
  </div>
  <div class="topics" v-if="showTopics !== false">
    <button type="button" class="topic input button small toggle" v-for="topic of internalTK.topics" :key="topic.id" :class="buttonClasses(topic)" @click="isMutable ? toggle(topic.id) : false">{{ topicText(topic) }}</button>
  </div>
  <a class="toggle-ignore-filter-text font-size-small a-text" v-if="showTopics !== false && filterText && filterText != ''" @click.prevent="toggleIgnoreFilterText">{{ ignoreFilterText ? '啟用關鍵字過濾' : '顯示所有議題' }}</a>
  <div class="selected-topic-keywords" v-if="internalShowSelectedTopicKeywords">
    <div class="section-title with-underline small margin-top-bottom-4"><span>熱門關鍵字</span></div>
    <div class="keywords" v-if="internalShowSelectedTopicKeywords">
      <span class="keyword secondary-text font-size-small" v-for="keyword in selectedTopicKeywords" :key="keyword">{{ keyword }}</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['limit', 'types', 'topics', 'selectedTopics', 'mutable', 'filterText', 'showTopics', 'showKeywords', 'showSelectedTopicKeywords'],
  data() {
    return {
      ignoreFilterText: false,
      selectedTopicKeywords: []
    }
  },
  computed: {
    filterIsOn() {
      return !this.ignoreFilterText && this.filterText !== undefined && this.filterText !== null && this.filterText !== ''
    },
    internalTypes() {
      return this.types && Array.isArray(this.types) && this.types.length > 0 ? this.types : ['watchout']
    },
    internalTK() {
      // filter topic with types
      let keywords = []
      let topics = this.topics.filter(topic => this.internalTypes.includes(topic.type))
      if(this.filterIsOn) {
        // filter topic with keywords
        keywords = []
        topics = topics.filter(topic => {
          if(topic.data.keywords && Array.isArray(topic.data.keywords)) {
            return topic.data.keywords.filter(word => {
              if(word.includes(this.filterText)) {
                keywords.push(word)
                return true
              } else {
                return false
              }
            }).length > 0
          } else {
            return false
          }
        })
      }
      return {
        topics,
        keywords
      }
    },
    isMutable() {
      return !(this.mutable === false)
    },
    customTopicClasses() {
      return this.buttonClasses(this.customTopicSelected)
    },
    internalShowKeywords() {
      return this.internalTK.keywords.length > 0 && this.showKeywords !== false
    },
    internalShowSelectedTopicKeywords() {
      return this.selectedTopicKeywords.length > 0 && this.showSelectedTopicKeywords !== false
    }
  },
  methods: {
    topicIsSelected(topicID) {
      return this.selectedTopics && Array.isArray(this.selectedTopics) ? this.selectedTopics.includes(topicID) : false
    },
    buttonClasses(topic) {
      let classes = []
      classes.push(this.topics[0].hasOwnProperty('battlefield') ? 'ask' : 'park') // FIXME: quick hack
      classes.push(this.isMutable ? 'mutable' : 'immutable')
      classes.push(this.topicIsSelected(topic.id) ? 'active' : 'inactive')
      return classes
    },
    topicText(topic) {
      return topic.hasOwnProperty('battlefield') ? (topic.year + topic.title) : topic.title
    },
    toggle(topicID) {
      let isSelected = this.topicIsSelected(topicID)
      if(isSelected) {
        this.selectedTopics.splice(this.selectedTopics.indexOf(topicID), 1)
      } else {
        if(this.limit && this.selectedTopics.length >= this.limit) {
          this.selectedTopics.shift()
        }
        this.selectedTopics.push(topicID)
      }
      this.selectedTopicKeywords = [].concat(...this.selectedTopics.map(topicID => {
        let topic = this.internalTK.topics.filter(topic => topic.id === topicID)[0]
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
