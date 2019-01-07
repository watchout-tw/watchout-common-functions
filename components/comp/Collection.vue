<template>
<div class="comp-collection">
  <div>{{ reference }}</div>
  <div class="items" v-if="collection">
    <div class="item" v-for="item of collection.items" :key="item.id">{{ item }}</div>
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
    }
  }
}
</script>
