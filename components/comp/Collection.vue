<template>
<div class="comp-collection margin-top-bottom-single">
  <h4 class="title section-title with-underline small text-align-center margin-top-bottom-8"><span>{{ collection.title }}</span></h4>
  <div class="items tcl-container no-margin" v-if="items">
    <a class="item tcl-panel half-width a-block" v-for="item of items" :key="item.id">
      <div class="pub-dest font-size-small" :class="'bg-' + item.content.publishedTo + '-light'">
        <div class="logo" :style="{ backgroundImage: 'url(' + getSmallProjectLogo(item.content.publishedTo) + ')' }"></div>
        <label>{{ getName(item.content.publishedTo) }}</label>
      </div>
      <div class="image" :style="getItemImageStyles(item)">
        <div v-if="getItemReference(item).type === 'video'" class="play-button"></div>
      </div>
      <div class="summary">
        <h4 class="title a-target">{{ item.content.title }}</h4>
      </div>
    </a>
  </div>
</div>
</template>

<script>
import { knowsWatchout } from 'watchout-common-functions/interfaces'
import { parseReference, makeReference, getContentPermalink } from 'watchout-common-functions/lib/bunko'

export default {
  mixins: [knowsWatchout],
  props: ['id', 'data'],
  computed: {
    reference() {
      return makeReference('collection', this.id)
    },
    collection() {
      return this.data ? this.data[this.reference] : null
    },
    items() {
      return this.collection ? this.collection.items.map(item => {
        return Object.assign({}, item, {
          content: this.data[item.reference]
        })
      }) : null
    }
  },
  methods: {
    getItemReference(item) {
      return parseReference(item.reference)
    },
    getItemImageStyles(item) {
      let styles = {}
      let url = getContentPermalink(item.content.image)
      if(url) {
        styles.backgroundImage = `url(${url})`
      }
      return styles
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-collection {
  > .items {
    > .item {
      background-color: $color-very-very-light-grey;
      @include shadow;
      > .image {
        @include rect(2/1);
        background-size: cover;
        background-position: center center;
        > .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      > .summary {
        padding: 0.5rem 0.75rem;
      }
      > .pub-dest {
        display: flex;
        align-items: center;
        > .logo {
          width: 24px;
          height: 24px;
          background-size: contain;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
