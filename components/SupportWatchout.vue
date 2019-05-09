<template>
<a class="support-watchout a-block" :href="link" target="_blank" :class="containerClasses">
  <h4 class="label line-height-tight" v-html="spacingOptimizer(label)"></h4>
  <div class="close left" @click.stop.prevent="toggleShowSupport(false)"></div>
</a>
</template>

<script>
import { env } from 'watchout-common-assets'
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import { spacingOptimizer } from 'watchout-common-functions/lib/bunko'

const supportPackages = {
  ask: {
    channel: 'ask',
    link: env.links.support.ask.direct,
    label: '支持沃草'
  },
  musou: {
    channel: 'musou',
    link: env.links.support.watchout.custom,
    label: '支持沃草'
  },
  lab: {
    channel: 'lab',
    link: env.links.support.watchout.direct,
    label: '支持沃草'
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
  z-index: $z-fixed;
  position: fixed;
  width: 9rem;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  @include shadow;
  > .label {
    position: relative;
    padding: 0.75rem 0;
    text-align: center;
    font-size: 1.125rem;
    line-height: 1;
  }
  & {
    > .label {
      color: black;
    }
  }
  &:hover, &:active {
    > .label {
      color: white;
    }
  }
}
</style>
