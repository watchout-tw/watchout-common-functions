<template>
<div class="support-watchout a-block" :class="containerClasses">
  <a class="support-link a-block monochrome" :href="link" target="_blank">
    <div class="label"><span class="a-target">{{ label }}</span></div>
    <div class="secondary-label">{{ secondaryLabel }}</div>
  </a>
  <div class="close-support-watchout" @click.stop.prevent="toggleShowSupport(false)">×</div>
</div>
</template>

<script>
import { env } from 'watchout-common-assets'
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import { spacingOptimizer } from 'watchout-common-functions/lib/bunko'

const supportPackages = {
  ask: {
    channel: 'ask',
    link: env.links.support.ask.direct,
    secondaryLabel: '給我們錢做更多專題',
    label: '支持沃草'
  },
  musou: {
    channel: 'musou',
    link: env.links.support.watchout.custom,
    secondaryLabel: '給我們錢做更多專題',
    label: '支持沃草'
  },
  lab: {
    channel: 'lab',
    link: env.links.support.watchout.direct,
    secondaryLabel: '給我們錢做更多專題',
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
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  @include shadow;
  width: 10.75rem;
  display: flex;
  justify-content: space-between;
  > .support-link {
    flex-shrink: 0;
    padding-left: 0.5rem;
    > .label {
      margin: 0.5rem 0 0.25rem;
      font-size: 1.125rem;
      font-weight: bold;
      line-height: 1;
    }
    > .secondary-label {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      line-height: 1.375;
    }
  }
  > .close-support-watchout {
    flex-shrink: 0;
    flex-basis: 2rem;
    font-size: 2rem;
    line-height: 0.875;
    text-align: right;
    padding: 0 0.25rem;
    cursor: pointer;
  }
}
</style>
