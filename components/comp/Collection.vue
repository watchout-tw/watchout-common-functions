<template>
<div class="comp-collection margin-top-bottom-single">
  <h4 class="title section-title with-underline text-align-center margin-top-bottom-8" v-if="title"><span>{{ title }}</span></h4>
  <div class="items tcl-container no-margin" v-if="items">
    <a class="item tcl-panel half-width a-block" :class="{ 'with-image': !!getItemImage(item) }" :href="item.reference.permalink" :target="['https', 'http'].includes(item.reference.type) ? '_blank' : ''" v-for="item of items" :key="item.id">
      <div class="image" :style="{ backgroundImage: 'url(' + getItemImage(item) + ')' }">
        <div v-if="item.reference.type === 'video'" class="button play"></div>
      </div>
      <div class="logo" :style="{ backgroundImage: 'url(' + getSmallProjectLogo(item.content && item.content.publishedTo ? item.content.publishedTo : 'external') + ')' }"></div>
      <div class="summary">
        <h4 class="title a-target">{{ item.title ? item.title : (item.content && item.content.title ? item.content.title : '未知的標題') }}</h4>
      </div>
    </a>
    <div class="tcl-panel half-width"></div>
    <div class="tcl-panel half-width"></div>
    <div class="tcl-panel half-width"></div>
  </div>
</div>
</template>

<script>
import { knowsWatchout } from 'watchout-common-functions/interfaces'
import { parseReference, makeReference } from 'watchout-common-functions/lib/watchout'

export default {
  mixins: [knowsWatchout],
  props: ['id', 'data', 'collection'],
  computed: {
    reference() {
      return makeReference('collection', this.id)
    },
    internalCollection() {
      return this.collection ? this.collection : (this.data ? this.data[this.reference] : null)
    },
    title() {
      return this.internalCollection ? this.internalCollection.title : null
    },
    items() {
      return this.internalCollection ? this.internalCollection.items.map(item => {
        let content = this.data ? this.data[item.reference] : null
        let publishedTo = content ? content.publishedTo : null
        return Object.assign({}, item, {
          reference: parseReference(item.reference, { publishedTo }),
          content
        })
      }) : null
    }
  },
  methods: {
    getItemImage(item) {
      let image = null
      if(item.content && item.content.hasOwnProperty('image') && typeof item.content.image === 'string') {
        let reference = parseReference(item.content.image)
        image = reference ? reference.permalink : null
      } else if(item.content && Array.isArray(item.content.images)) {
        image = item.content.images[0]
      }
      return image
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-collection {
  > .items {
    > .item {
      position: relative;
      background-color: $color-very-very-light-grey;
      @include shadow;
      > .image {
        display: none;
      }
      > .logo {
        width: 24px;
        height: 24px;
        background-size: contain;
      }
      > .summary {
        padding: 0.5rem 0.75rem;
      }
      &.with-image {
        > .image {
          @include rect(2/1);
          background-color: $color-very-light-grey;
          background-size: cover;
          background-position: center center;
          > .button.play {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        > .logo {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
}
</style>
