<template>
<div class="answer-reader" :class="containerClasses">
  <div class="signature" :class="fullWidthSubcontainerClasses">
    <cover-image :url="answer.image" type="topic" width="4" />
    <div class="text tcl-left-right-margin">
      <div class="excerpt" v-if="isCompact">
        <span>{{ excerpt }}</span>
        <nuxt-link v-if="isCompact" class="read-more a-text font-size-small" :to="linkToSelf">繼續閱讀</nuxt-link>
      </div>
      <authorship v-if="!isFull" :avatar="answer.persona.avatar" :name="answer.persona.name" :link="getParkPersonaProfileURL(answer.persona.id)" :date="answer.review.startDate" score="4.2" />
    </div>
    <share-button :classes="['top-right']" :item="answer" />
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
    <div class="content">{{ answer.content }}</div>
    <authorship v-if="!isPreview" :avatar="answer.persona.avatar" :name="answer.persona.name" :link="getParkPersonaProfileURL(answer.persona.id)" :date="answer.review.startDate" />
  </div>
  <div v-if="isFull" class="references-container" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>參考資料</span>
    </div>
    <div v-if="!answer.references || answer.references.length < 1" class="not-available">沒有參考資料</div>
    <ul v-else class="bulleted-list references">
      <li class="reference" v-for="reference of answer.references">
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
  <div v-if="!isPreview && reviewable" class="review" :class="subcontainerClasses">
    <like-buttons :config="likeButtonsConfig" :state="reviewState" @review-terrible="onReviewTerrible"  @review-bad="onReviewBad" @review-okay="onReviewOkay" @review-good="onReviewGood" @review-great="onReviewGreat" />
    <div class="review-summary text-align-right font-size-small secondary-text">
      <template v-if="answer.review.count <= 0">還沒有人評分</template>
      <template v-else>平均<span class="latin-within-han">{{ answer.review.average ? (answer.review.average).toPrecision(2) : 0 }}</span>分；<span class="latin-within-han first">{{ answer.review.count }}</span>人已評分</template>
    </div>
  </div>
  <div v-if="isFull" :class="subcontainerClasses">
  </div>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
import * as core from '../../lib/core'
import * as util from '../../lib/util'
import { knowsAuth, knowsError, knowsWatchout, knowsWindowManagement } from '../../interfaces'
import Authorship from './Authorship'
import CoverImage from '../CoverImage'
import LikeButtons from '../button/Like'
import ShareButton from '../button/Share'

const REVIEWS = {
  TERRIBLE: 1,
  BAD: 2,
  OKAY: 3,
  GOOD: 4,
  GREAT: 5
}

const likeButtonsConfig = {
  showCount: false,
  options: [
    {
      event: 'review-terrible',
      value: 'terrible',
      label: REVIEWS.TERRIBLE,
      inactiveClasses: [
        'review',
        'terrible'
      ],
      activeClasses: [
        'review',
        'terrible',
        'active'
      ],
      showText: true
    },
    {
      event: 'review-bad',
      value: 'bad',
      label: REVIEWS.BAD,
      inactiveClasses: [
        'review',
        'bad'
      ],
      activeClasses: [
        'review',
        'bad',
        'active'
      ],
      showText: true
    },
    {
      event: 'review-okay',
      value: 'okay',
      label: REVIEWS.OKAY,
      inactiveClasses: [
        'review',
        'okay'
      ],
      activeClasses: [
        'review',
        'okay',
        'active'
      ],
      showText: true
    },
    {
      event: 'review-good',
      value: 'good',
      label: REVIEWS.GOOD,
      inactiveClasses: [
        'review',
        'good'
      ],
      activeClasses: [
        'review',
        'good',
        'active'
      ],
      showText: true
    },
    {
      event: 'review-great',
      value: 'great',
      label: REVIEWS.GREAT,
      inactiveClasses: [
        'review',
        'great'
      ],
      activeClasses: [
        'review',
        'great',
        'active'
      ],
      showText: true
    }
  ]
}

export default {
  mixins: [knowsAuth, knowsError, knowsWatchout, knowsWindowManagement],
  props: ['answer', 'personaSpeeches', 'reviewCount', 'reviewAverage', 'mode', 'showQuestion', 'reviewable', 'preview'],
  data() {
    return {
      likeButtonsConfig,
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
    },
    reviewState() {
      let score = util.getMyAnswerReviewScore(this.answer)
      return {
        me: {
          terrible: score === REVIEWS.TERRIBLE,
          bad: score === REVIEWS.BAD,
          okay: score === REVIEWS.OKAY,
          good: score === REVIEWS.GOOD,
          great: score === REVIEWS.GREAT
        }
      }
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
    onReview: debounce(function() {
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
    onReviewTerrible() {
      this.scoreToSubmit = REVIEWS.TERRIBLE
      this.onReview()
    },
    onReviewBad() {
      this.scoreToSubmit = REVIEWS.BAD
      this.onReview()
    },
    onReviewOkay() {
      this.scoreToSubmit = REVIEWS.OKAY
      this.onReview()
    },
    onReviewGood() {
      this.scoreToSubmit = REVIEWS.GOOD
      this.onReview()
    },
    onReviewGreat() {
      this.scoreToSubmit = REVIEWS.GREAT
      this.onReview()
    },
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
    LikeButtons,
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
  > .review {
    > .review-summary {
      margin: 0.25rem 0;
    }
  }
}
</style>
