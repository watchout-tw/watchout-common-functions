<template>
<div class="share-button" :class="classes" @click="share"></div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsWindowManagement],
  props: ['classes', 'url'],
  methods: {
    share() {
      this.addModal({ id: 'share', url: this.url })
    }
  }
}
</script>

<style lang="scss">
.share-button {
  width: 2.25rem;
  height: 2.25rem;
  background-image: url('~watchout-common-assets/images/generic-component/share.png');
  background-size: contain;
  cursor: pointer;

  &.top-right {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
