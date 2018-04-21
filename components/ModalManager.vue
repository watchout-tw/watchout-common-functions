<template>
<div class="modal-manager">
  <transition name="modal" appear v-for="modal of modals" :key="modal.id">
    <div class="modal-overlay"  @click.self="removeModal(modal.id)">
      <component :is="modal.id" :data="modal"></component>
    </div>
  </transition>
</div>
</template>

<script>
import { knowsWindowManagement } from '../interfaces' // FIXME: no relative paths
import * as modals from './modal'
export default {
  mixins: [knowsWindowManagement],
  components: modals
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

// for vue transition
.modal-enter { // this also applies to initial render of elements with "appear" attr
  opacity: 0;
  .modal {
    transform: scale(1.1);
  }
}
.modal-leave-to {
  opacity: 0;
  .modal {
    transform: scale(1.1);
  }
}

$animation-parameters: .25s ease;
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: $z-modal;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $color-modal-overlay-white;
  transition: opacity $animation-parameters;
  > .modal {
    transition: transform $animation-parameters;
  }
}
</style>
