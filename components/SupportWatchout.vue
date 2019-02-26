<template>
<a class="support-watchout a-block" :href="action.link" target="_blank" :class="containerClasses">
  <div class="slogan">
    <h5 class="line-height-tight" v-for="(line, index) of slogan" v-html="spacingOptimizer(line)" :key="`line-${index}`"></h5>
  </div>
  <div class="action">
    <h4 class="line-height-tight" v-html="spacingOptimizer(action.label)"></h4>
  </div>
  <div class="close white" @click.stop.prevent="toggleShowSupport(false)"></div>
</a>
</template>

<script>
import { env } from 'watchout-common-assets'
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import { spacingOptimizer } from 'watchout-common-functions/lib/bunko'

const supportPackages = {
  ask: {
    channel: 'ask',
    slogan: [
      '立委、市長、候選人',
      '全都來《給問擂台》面對 😡'
    ],
    image: 'pitcher',
    action: {
      link: env.links.support.ask.direct,
      label: '支持沃草'
    }
  },
  musou: {
    channel: 'musou',
    slogan: [
      '我們想做更多有意義的專題',
      '但真的缺錢 😢'
    ],
    image: 'farmer_hat',
    action: {
      link: env.links.support.watchout.custom,
      label: '支持沃草'
    }
  },
  lab: {
    channel: 'lab',
    slogan: [
      '法案拆解、議事分析好難',
      '需要你的加油打氣 😢'
    ],
    image: 'pitcher',
    action: {
      link: env.links.support.watchout.direct,
      label: '支持沃草'
    }
  }
}

export default {
  mixins: [knowsWindowManagement],
  props: ['id'],
  data() {
    return supportPackages[this.id]
  },
  computed: {
    containerClasses() {
      return ['bg-' + this.channel + '-almost-opaque']
    },
    actionImage() {
      return require('watchout-common-assets/images/support/' + this.action.image + '.png')
    }
  },
  methods: {
    spacingOptimizer
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.support-watchout {
  position: fixed;
  width: 100%;
  max-width: 12.75rem;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-fixed;
  @include shadow;
  padding: 0.5rem 0.75rem 0.625rem;
  > .action {
    position: relative;
    line-height: 1;
    margin-top: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1.5rem;
    text-align: center;
    background-color: rgba(white, 0.5);
  }
}
</style>
