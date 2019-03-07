<template>
<div class="answer-reader" :class="containerClasses">
  <div class="signature" :class="fullWidthSubcontainerClasses">
    <cover-image :url="answer.image" type="topic" width="4" />
    <div class="text tcl-left-right-margin">
      <div class="excerpt" v-if="isCompact">
        <span>{{ excerpt }}</span>
        <nuxt-link v-if="isCompact" class="read-more a-text font-size-small" :to="linkToSelf">繼續閱讀</nuxt-link>
      </div>
      <authorship v-if="!isFull" :persona="answer.persona" :parties="parties" score="4.2" :date="answer.review.startDate" />
    </div>
    <share-button :classes="['top-right']" :url="shareURL" />
  </div>
  <div v-if="!isPreview && showQuestion" class="original-question" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>原始問題</span>
    </div>
    <div class="question secondary-text">
      <nuxt-link :to="{ name: 'games-gameSlug-questions-id', params: { gameSlug: answer.question.game.slug, id: answer.question.id } }" class="a-block"><span class="a-target">{{ answer.question.title }}</span></nuxt-link>
    </div>
  </div>
  <div v-if="isFull" class="detail" :class="subcontainerClasses">
    <div class="content paragraphs first" v-html="minimalMarkdown(answer.content)"></div>
    <authorship v-if="!isPreview" :persona="answer.persona" :parties="parties" score="4.2" :date="answer.review.startDate" />
  </div>
  <div v-if="isFull" class="references-container" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>參考資料</span>
    </div>
    <div v-if="!answer.references || answer.references.length < 1" class="not-available">沒有參考資料</div>
    <ul v-else class="bulleted-list references">
      <li class="reference" v-for="(reference, index) of answer.references" :key="index">
        <div class="title">
          <template v-if="reference.url">
            <a class="a-text" :href="reference.url" target="_blank">{{ reference.title }}</a>
          </template>
          <template v-else>{{ reference.title }}</template>
        </div>
        <div v-if="reference.description" class="font-size-small">{{ reference.description }}</div>
      </li>
    </ul>
  </div>
  <div v-if="!isPreview && reviewable" :class="subcontainerClasses">
    <review :score="answer.review.average" :count="answer.review.count" :my-reviewed-score="myAnswerReviewScore" @reviewed="onReview" />
  </div>
  <div v-if="isFull" :class="subcontainerClasses">
  </div>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
import * as core from '../../lib/core'
import * as util from '../../lib/util'
import { knowsAuth, knowsError, knowsMarkdown, knowsWatchout, knowsWindowManagement } from '../../interfaces'
import CoverImage from '../CoverImage'
import Review from '../Review'
import ShareButton from '../button/Share'
import Authorship from './Authorship'

export default {
  mixins: [knowsAuth, knowsError, knowsMarkdown, knowsWatchout, knowsWindowManagement],
  props: ['game', 'answer', 'personaSpeeches', 'reviewCount', 'reviewAverage', 'mode', 'showQuestion', 'reviewable', 'preview', 'parties'],
  data() {
    return {
      scoreToSubmit: -1
    }
  },
  computed: {
    isCompact() {
      return this.mode === 'compact'
    },
    isFull() {
      return this.mode === 'full'
    },
    isPreview() {
      return this.preview
    },
    containerClasses() {
      let classes = []
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
    },
    shareURL() {
      return this.game && this.answer ? this.getAskAnswerURL(this.game.slug, this.answer.id) : null
    },
    myAnswerReviewScore() {
      return util.getMyAnswerReviewScore(this.answer)
    }
  },
  beforeMount() {
    if(!this.isPreview) {
      this.clientSideReload()
    }
  },
  watch: {
    'isCitizen'() {
      this.clientSideReload()
    }
  },
  methods: {
    onReview(score) {
      this.scoreToSubmit = score
      this.onReviewDebounce()
    },
    onReviewDebounce: debounce(function() {
      if(!this.isCitizen) {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      } else if(!this.activePersonaIsWithInfo) {
        this.addModal('private-info-registration')
      } else {
        core.reviewAnswer(this.answer.id, this.scoreToSubmit).then(response => {
          this.reviewed(response.data)
        }).catch(this.handleError)
      }
    }, 500),
    reviewed(reviewedAnswer) {
      this.clientSideUpdate(reviewedAnswer)
      this.$emit('reviewed')
    },
    clientSideReload() {
      core.getAnswer(this.answer.id).then(responses => {
        this.clientSideUpdate(responses.data)
      })
    },
    clientSideUpdate(answer) {
      this.$emit('update:personaSpeeches', answer.persona_speeches)
      this.$emit('update:reviewCount', answer.review.count)
      this.$emit('update:reviewAverage', answer.review.average)
    }
  },
  components: {
    Authorship,
    CoverImage,
    Review,
    ShareButton
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
      > .excerpt {
        margin: 0.25rem 0;
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
  > .original-question {
    > .question {
      margin: 0.25rem 0;
    }
  }
  > .references-container {
    > .section-title {
      margin: 1em 0 0.5rem;
    }
  }
}
</style>
