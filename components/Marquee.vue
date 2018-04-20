<template>
<div class="marquee" :class="classes">
  <div class="content d-flex" :style="contentStyles">
    <div v-for="ancm of announcements" class="announcement d-flex" :class="ancm.type">
      <label>{{ typeLabels[ancm.type] }}</label>
      <span>{{ ancm.content }}</span>
      <a v-if="ancm.action" :href="ancm.action.link" class="a-text action">{{ ancm.action.label }}</a>
    </div>
  </div>
</div>
</template>

<script>
import env from 'watchout-common-assets/environment'

export default {
  props: ['classes'],
  mounted() {
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
  },
  data() {
    return {
      announcements: env.announcements.rows,
      typeLabels: {
        breaking: '快訊',
        livestream: '直播'
      },
      animationDuration: 12
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

    > .announcement {
      margin: 0 2rem;
      padding: 1rem;

      > label {
        font-weight: bold;
        font-size: 0.75rem;
        margin-right: 0.25rem;
      }
      > .action {
        font-weight: bold;
        font-size: 0.875rem;
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
        > label {
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

.marquee > .content > span::before {
  content: '快訊';
  padding-left: 4px;
  padding-right: 4px;
  color: #ff5368;
}
</style>
