<template>
<div class="comp-collection margin-top-bottom-single">
  <h4 class="title section-title with-underline small margin-top-bottom-8"><span>{{ collection.title }}</span></h4>
  <div class="items" v-if="items">
    <a class="item a-block" v-for="item of items" :key="item.id">
      <div class="image" v-if="item.content.image" :style="getItemImageStyles(item)"></div>
      <div class="summary">
        <h4 class="a-target">{{ item.content.title }}</h4>
      </div>
    </a>
  </div>
</div>
</template>

<script>
import { makeReference, getContentPermalink } from 'watchout-common-functions/lib/bunko'

export default {
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
      margin: 1rem 0;
      background-color: $color-very-very-light-grey;
      @include shadow;
      &:first-child {
        margin-top: 0;
      }
      > .image {
        @include rect(4/1);
        background-size: cover;
      }
      > .summary {
        padding: 0.5rem 0.75rem;
      }
    }
  }
}
</style>
