<template>
<div class="comp-collection margin-top-bottom-single">
  <h4 class="title section-title with-underline small margin-top-bottom-8"><span>{{ collection.title }}</span></h4>
  <div class="items" v-if="items">
    <a class="item a-block" v-for="item of items" :key="item.id">
      <div class="image">{{ item.content.image }}</div>
      <div class="summary">
        <h4 class="a-target">{{ item.content.title }}</h4>
      </div>
    </a>
  </div>
</div>
</template>

<script>
import { makeReference } from 'watchout-common-functions/lib/bunko'

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
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-collection {
  > .items {
    > .item {
      margin: 1rem 0;
      padding: 0.5rem 0.75rem;
      background-color: $color-very-very-light-grey;
      @include shadow;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
