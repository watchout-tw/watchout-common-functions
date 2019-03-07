<template>
  <div class="review">
    <like-buttons :config="likeButtonsConfig" :state="reviewState" @review-terrible="onReviewTerrible" @review-bad="onReviewBad" @review-okay="onReviewOkay" @review-good="onReviewGood" @review-great="onReviewGreat" />
    <div class="review-summary text-align-right font-size-small secondary-text">
      <template v-if="count <= 0">還沒有人評分</template>
      <template v-else>平均<span class="latin-within-han">{{ score ? (score).toPrecision(2) : 0 }}</span>分；<span class="latin-within-han first">{{ count }}</span>人已評分</template>
    </div>
  </div>
</template>

<script>
import LikeButtons from './button/Like'

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
  props: ['score', 'count', 'myReviewedScore'],
  data() {
    return {
      likeButtonsConfig
    }
  },
  computed: {
    reviewState() {
      return {
        me: {
          terrible: this.myReviewedScore === REVIEWS.TERRIBLE,
          bad: this.myReviewedScore === REVIEWS.BAD,
          okay: this.myReviewedScore === REVIEWS.OKAY,
          good: this.myReviewedScore === REVIEWS.GOOD,
          great: this.myReviewedScore === REVIEWS.GREAT
        }
      }
    }
  },
  methods: {
    onReviewTerrible() {
      this.$emit('reviewed', REVIEWS.TERRIBLE)
    },
    onReviewBad() {
      this.$emit('reviewed', REVIEWS.BAD)
    },
    onReviewOkay() {
      this.$emit('reviewed', REVIEWS.OKAY)
    },
    onReviewGood() {
      this.$emit('reviewed', REVIEWS.GOOD)
    },
    onReviewGreat() {
      this.$emit('reviewed', REVIEWS.GREAT)
    }
  },
  components: {
    LikeButtons
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.review {
  > .review-summary {
    margin: 0.25rem 0;
  }
}
</style>
