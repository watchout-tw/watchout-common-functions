<template>
<div class="support-watchout">
  <a :href="link" target="_blank" class="container" :class="containerClasses">
    <div class="appeal">
      <div class="line" v-for="line of text">{{ line }}</div>
    </div>
    <div class="action">
      <img class="image" :src="actionImage"/>
      <div class="text">{{ action.text }}</div>
    </div>
    <div class="close white" @click.stop.prevent="toggleShowSupport(false)"></div>
  </a>
</div>
</template>

<script>
import { env } from 'watchout-common-assets'
import { knowsWindowManagement } from '../interfaces' // FIXME: no relative paths

const supportPackages = {
  ask: {
    channel: 'ask',
    link: env.links.support.ask.direct,
    text: [
      '沃草年度巨獻：《給問擂台》',
      '六都市長給問嗎，真的很缺錢。'
    ],
    action: {
      image: 'pitcher',
      text: '灌溉好專案'
    }
  },
  musou: {
    channel: 'musou',
    link: env.links.support.watchout.custom,
    text: [
      '請支持我們做更多有意義的專題',
      '因為很缺錢，真的很缺。'
    ],
    action: {
      image: 'farmer_hat',
      text: '支持沃草，成為草民'
    }
  },
  lab: {
    channel: 'lab',
    link: env.links.support.watchout.direct,
    text: [
      '更多法案拆解、議事紀錄分析',
      '需要你的幫助。'
    ],
    action: {
      image: 'pitcher',
      text: '支持沃草，灌溉議題'
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
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.support-watchout {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 16 * $rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-fixed;
  @include bp-sm-up {
    max-width: $bp-sm - 2 * $rem;
  }

  > .container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-around;
    @include shadow;
    position: relative;
    width: 100%;
    max-width: none;
    margin: 0 auto;
    padding: 0.5rem 1rem;

    @include bp-sm-up {
      flex-direction: row;
      padding: 0.75rem 1rem;
    }

    > .appeal {
      padding: 0.25rem;
      text-align: center;
      font-size: 0.875rem;
      line-height: 1;
      font-weight: bold;
      color: rgba(black, 0.95);
      > .line {
        margin: 0;
        padding: 0;
        line-height: 1;
        &:not(:last-child) {
          margin-bottom: 0.25rem;
        }
      }
      @include bp-sm-up {
        text-align: left;
        font-size: 1.125rem;
        > .line {
          &:not(:last-child) {
            margin-bottom: 0.375rem;
          }
        }
      }
    }
    > .action {
      position: relative;
      padding: 0.25rem;
      text-align: center;
      > .image {
        position: absolute;
        top: 0;
        left: 0;
        width: 42px;
        margin-left: -0.5rem;
      }
      > .text {
        display: inline-block;
        border: none;
        border-radius: 1.5rem;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        line-height: 1;
        background: rgba(white, 0.65);
        color: black;
      }
    }

    &:hover > .action > .text {
      background: rgba(white, 0.95);
    }
  }
}
</style>
