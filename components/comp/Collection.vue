<template>
<div class="comp-collection">
  <div>
    {{ reference }}
  </div>
  <div class="items">
    <div class="item" v-for="item of collection.items">
      {{ item }}
    </div>
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
      return this.data[this.reference]
    }
  }
}
</script>
