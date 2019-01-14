<template>
<div class="marquee" :class="classes">
  <div class="content d-flex" :style="contentStyles">
    <div v-for="ancm of ancms" class="ancm" :class="ancm.type">
      <span class="type">{{ types[ancm.type] }}</span>
      <span>{{ ancm.description }}</span>
      <a :href="ancm.actionLink" class="action a-text">{{ ancm.actionLabel }}</a>
    </div>
  </div>
</div>
</template>

<script>
import * as firestore from 'watchout-common-functions/lib/firestore'

export default {
  props: ['classes'],
  data() {
    return {
      types: {
        breaking: '快訊',
        livestream: '直播'
      },
      ancms: [],
      animationDuration: 12
    }
  },
  async mounted() {
    let ancms = await firestore.watchout.getAncms()
    this.ancms.push(...ancms)
    window.addEventListener('resize', this.setAnimationDuration)
    this.setAnimationDuration()
  },
  methods: {
    setAnimationDuration() {
      var width = this.$el.getBoundingClientRect().width
      this.animationDuration = Math.round(width / 320.0) * 12
    }
  },
  computed: {
    contentStyles() {
      return {
        animationDuration: this.animationDuration + 's'
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

@keyframes marquee {
  0% {
    transform: translateX(0)
  }
  100% {
    transform: translateX(-100%)
  }
}
.marquee {
  position: relative;
  width: 100%;
  height: 3rem;
  line-height: 1rem;
  overflow: hidden;
  > .content {
    position: absolute;
    display: block;
    width: auto;
    padding-left: 100%;
    white-space: nowrap;
    overflow: visible;
    animation: marquee 8s linear infinite;
    > .ancm {
      margin: 0 2rem;
      padding: 1rem;
      display: flex;
      > .type {
        font-weight: bold;
        font-size: $font-size-small;
        margin-right: 0.25rem;
      }
      > .action {
        font-weight: bold;
        font-size: $font-size-small;
      }
      &.breaking {
        &::before {
          content: '';
          margin: 0 0.25rem;
          width: 1rem;
          height: 1rem;
          border-radius: 1rem;
          background-color: $color-musou;
        }
        > .type {
          color: $color-musou;
        }
      }
    }
  }
  &:hover > .content {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
}
</style>
