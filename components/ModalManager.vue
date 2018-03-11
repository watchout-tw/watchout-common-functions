<template>
<div class="modal-manager">
  <div class="modal-overlay" v-for="modal of modals" :key="modal"></div>
</div>
</template>

<script>
import { knowsWindowManagement } from '../interfaces' // FIXME: no relative paths
export default {
  mixins: [knowsWindowManagement]
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal-overlay {
  position: fixed;
  z-index: $z-modal;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $color-modal-overlay-white;
  transition: opacity .3s ease;
}
</style>
