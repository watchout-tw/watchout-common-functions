<template>
<div class="answer-reader" :class="containerClasses">
  <div class="signature" :class="fullWidthSubcontainerClasses">
    <cover-image :url="answer.image" type="topic" width="4" />
    <div class="text tcl-left-right-margin">
      <div class="excerpt" v-if="isCompact">
        <span>{{ excerpt }}</span>
        <nuxt-link v-if="isCompact" class="read-more a-text font-size-smaller" :to="linkToSelf">繼續閱讀</nuxt-link>
      </div>
      <authorship v-if="!isFull" :avatar="answer.persona.avatar" :name="answer.persona.name" :link="getParkPersonaProfileURL(answer.persona.id)" :date="answer.question.push.startDate" score="4.3" />
    </div>
    <share-button :classes="['top-right']" :item="answer" />
  </div>
  <div v-if="!preview" class="origin-question" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>原始問題</span>
    </div>
    {{ answer.question.title }}
  </div>
  <div v-if="isFull" class="detail" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>答案</span>
    </div>
    <div class="content">{{ answer.content }}</div>
    <authorship v-if="!preview" :avatar="answer.persona.avatar" :name="answer.persona.name" :link="getParkPersonaProfileURL(answer.persona.id)" :date="answer.review.startDate" />
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
        <div v-if="reference.description" class="font-size-smaller">{{ reference.description }}</div>
      </li>
    </ul>
  </div>
  <div v-if="!preview" class="review" :class="subcontainerClasses">
    <div class="section-title with-underline small">
      <span>評分</span>
    </div>
    <like-buttons :config="likeButtonsConfig" :state="getReview()" @review-terrible="onReviewTerrible"  @review-bad="onReviewBad" @review-okay="onReviewOkay" @review-good="onReviewGood" @review-great="onReviewGreat" />
    <div class="review-summary text-align-right font-size-smaller">
      <template v-if="answer.review.count <= 0">還沒有人評分</template>
      <template v-else>平均<span class="latin-within-han">{{ answer.review.average ? answer.review.average : 0 }}</span>分；<span class="latin-within-han first">{{ answer.review.count }}</span>人已評分</template>
    </div>
  </div>
  <div v-if="isFull" :class="subcontainerClasses">
  </div>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
import * as core from '../../lib/core'
import { knowsAuth, knowsError, knowsWatchout, knowsWindowManagement } from '../../interfaces'
import Authorship from './Authorship'
import CoverImage from '../CoverImage'
import LikeButtons from '../button/Like'
import ShareButton from '../button/Share'

const likeButtonsConfig = {
  showCount: false,
  options: [
    {
      event: 'review-terrible',
      value: 1,
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
      value: 2,
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
      value: 3,
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
      value: 4,
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
      value: 5,
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
  props: ['answer', 'mode', 'preview'],
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
    getReview() {
      return {
        me: {
          terrible: false,
          bad: false,
          okay: false,
          good: false,
          great: false
        }
      }
    },
    onReview: debounce(function() {
      if(!this.isCitizen) {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      } else if(!this.activePersonaIsWithInfo) {
        this.addModal('private-info-registration')
      } else {
        core.reviewAnswer(this.answer.id, this.scoreToSubmit).then(response => {
          this.reviewed()
        }).catch(this.handleError)
      }
    }, 500),
    onReviewTerrible() {
      this.scoreToSubmit = 1
      this.onReview()
    },
    onReviewBad() {
      this.scoreToSubmit = 2
      this.onReview()
    },
    onReviewOkay() {
      this.scoreToSubmit = 3
      this.onReview()
    },
    onReviewGood() {
      this.scoreToSubmit = 4
      this.onReview()
    },
    onReviewGreat() {
      this.scoreToSubmit = 5
      this.onReview()
    },
    reviewed() {
      this.$emit('reviewed')
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
