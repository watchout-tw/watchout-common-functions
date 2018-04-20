<template>
<div class="question-reader" :class="containerClasses">
  <div class="signature" :class="fullWidthSubcontainerClasses">
    <cover-image :url="question.image" width="4" />
    <div class="tcl-left-right-margin">
      <h1 v-if="this.isFull" class="small">{{ question.title }}</h1>
      <h2 v-else>{{ question.title }}</h2>
      <div class="excerpt" v-if="isCompact">{{ excerpt }}</div>
      <div class="more" v-if="isCompact">
        <nuxt-link class="a-text" :to="{ name: 'games-gameSlug-questions-id', params: { gameSlug: question.game.slug, id: question.id }}">繼續閱讀</nuxt-link>
      </div>
    </div>
    <share-button :classes="['top-right']"/>
  </div>
  <div class="status" :class="subcontainerClasses" v-if="!isPreview && pushable">
    <div>{{ question.push.count }}/{{ question.data.threshold }}</div>
    <button :class="pushBtnClass" v-on:click="push(question.id)">{{ pushBtnText }}</button>
  </div>
  <div class="detail" :class="subcontainerClasses">
    <div class="content" v-if="isFull">{{ question.content }}</div>
    <div class="authorship">
      <div class="author">
        <avatar :avatar="isPreview ? activePersona.avatar : question.persona.avatar" :classes="['shadow', 'inline', 'small']"/>
        <span class="name">{{ isPreview ? activePersona.name : question.persona.name }}</span>
      </div>
      <div class="date">{{ isPreview ? currentTime : questionStartDate }}</div>
    </div>
  </div>
  <!-- TODO: Add style here -->
  <div class="references">
    <div v-for="ref of question.references">
    {{ ref.url }}
    {{ ref.description}}
    </div>
  </div>
  <div class="appointments" :class="subcontainerClasses" v-if="isFull">
  </div>
</div>
</template>

<script>
import * as core from '~/lib/core'
import * as util from '~/lib/util'
import { knowsAuth } from '../../interfaces'
import CoverImage from '../CoverImage'
import Avatar from '../Avatar'
import ShareButton from '../button/Share'
import Quiero from './Quiero'

export default {
  mixins: [knowsAuth],
  props: ['question', 'mode', 'pushable', 'preview'],
  data () {
    return {
      currentTime: util.formatter.date(new Date())
    }
  },
  computed: {
    isCompact() {
      return this.mode === 'compact'
    },
    isFull() {
      return this.mode === 'full'
    },
    isPreview () {
      return this.preview
    },
    questionStartDate () {
      return util.formatter.date(this.question.push.startDate)
    },
    containerClasses() {
      var classes = []
      if(this.isCompact) {
        classes.push('tcl-panel')
      } else if(this.isFull) {
        classes.push('tcl-container')
      }
      return classes
    },
    fullWidthSubcontainerClasses() {
      return this.isFull ? ['tcl-panel'] : []
    },
    subcontainerClasses() {
      return this.isFull ? ['tcl-panel', 'tcl-left-right-margin'] : ['tcl-left-right-margin']
    },
    titleTag() {
      return this.isFull ? 'h1' : 'h3'
    },
    excerpt() {
      return this.question.content ? this.question.content.substr(0, 50) + '⋯' : ''
    },
    pushBtnClass () {
      return util.pushBtnClassMapper(this.question)
    },
    pushBtnText () {
      return util.pushBtnTextMapper(this.question)
    }
  },
  methods: {
    push(id) {
      core.pushQuestion(id).then(response => {
        console.log(response)
      }).catch(error => {
        console.error(error)
      })
    }
  },
  components: {
    CoverImage,
    ShareButton,
    Avatar,
    Quiero
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.question-reader {
  position: relative;

  > .signature {
    > .cover {
      @include rect(5/1);
      background-size: 100%;
      background-position: center center;
    }
  }
  > .detail {
    > .authorship {
      > .author {
        margin: 0.25rem 0;
        > .name {
          display: inline-block;
          vertical-align: middle;
          margin-left: 0.25rem;
        }
      }
      > .date {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
