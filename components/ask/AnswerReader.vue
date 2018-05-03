<template>
<div class="answer-reader" :class="containerClasses">
  <div class="signature" :class="fullWidthSubcontainerClasses">
    <cover-image :url="answer.image" type="topic" width="4" />
    <div class="text tcl-left-right-margin">
      <component :is="isFull ? 'h1' : 'h2'" class="title" :class="isFull ? 'medium' : ''">
        <nuxt-link v-if="isCompact" class="a-text" :to="linkToSelf">{{ answer.title }}</nuxt-link>
        <template v-else>{{ answer.title }}</template>
      </component>
      <div class="excerpt" v-if="isCompact">
        <span>{{ excerpt }}</span>
        <nuxt-link v-if="isCompact" class="read-more a-text font-size-smaller" :to="linkToSelf">繼續閱讀</nuxt-link>
      </div>
      <authorship v-if="!isFull" :avatar="answer.persona.avatar" :name="answer.persona.name" :link="getParkPersonaProfileURL(answer.persona.id)" :date="answer.question.push.startDate" score="4.3" />
    </div>
    <share-button :classes="['top-right']" :item="answer" />
  </div>
  <div v-if="isCompact" class="origin-question" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>原始問題</span>
    </div>
    {{ answer.question.title }}
  </div>
  <div v-if="isCompact" class="origin-question" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>評分</span>
    </div>
    <review-buttons :answer="answer" v-on:review="toReview" />
    <div class="font-size-smaller">平均<span class="latin-within-han">{{ answer.review.average ? answer.review.average : 0 }}</span>分；已經有<span class="latin-within-han">{{ answer.review.count }}</span>人評分</div>
  </div>
</div>
</template>

<script>
import * as core from '../../lib/core'
import { knowsAuth, knowsWatchout, knowsWindowManagement } from '../../interfaces'
import Authorship from './Authorship'
import CoverImage from '../CoverImage'
import ReviewButtons from '../button/Review'
import ShareButton from '../button/Share'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['answer', 'mode'],
  computed: {
    isCompact () {
      return this.mode === 'compact'
    },
    isFull () {
      return this.mode === 'full'
    },
    containerClasses() {
      var classes = []
      if(this.isCompact) {
        classes.push('compact')
        classes.push('tcl-panel')
      } else if(this.isFull) {
        classes.push('full')
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
    excerpt() {
      return this.answer.content ? this.answer.content.substr(0, 50) + '⋯' : ''
    },
    linkToSelf() {
      return {
        name: 'games-gameSlug-answers-id',
        params: {
          gameSlug: this.answer.question.game.slug,
          id: this.answer.id
        }
      }
    }
  },
  methods: {
    toReview () {
      if(!this.isCitizen) {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      } else if(this.activePersonaIsWithInfo) {
        // FIXME: API is not ready yet
        core.reviewAnswer(this.answer.id).then(response => {
          this.reviewed()
          console.log(response)
        }).catch(error => {
          console.error(error)
        })
      } else {
        this.addModal('private-info-registration')
      }
    },
    reviewed () {
      this.$emit('reviewed')
    }
  },
  components: {
    Authorship,
    CoverImage,
    ShareButton,
    ReviewButtons
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.answer-reader {
  position: relative;
  > .signature {
    > .cover {
      @include rect(5/1);
      background-size: 100%;
      background-position: center center;
    }
    > .text {
      > .title {
        margin: 0.25rem 0;
      }
      > .excerpt {
        > .read-more {
          margin: 0 0.25rem;
        }
      }
    }
  }
  &.compact {
    > .signature {
      margin-bottom: 1rem;
    }
  }
  > .status {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
  }
  > .references-container {
    > .section-title {
      margin: 1em 0 0.5rem;
    }
  }
  > .assigned-personas-container {
    > .section-title {
      margin: 1em 0 0.5rem;
    }
    > .personas {
      > .persona {
        display: flex;
        align-items: center;
        > .assigned {
          margin-right: 0.5rem;
        }
        > .name {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>