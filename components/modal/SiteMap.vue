<template>
<div class="modal site-map">
  <menu-double :menu="data.menu" @itemClicked="removeModal('site-map')" />
</div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import MenuDouble from 'watchout-common-functions/components/MenuDouble'
export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  components: {
    MenuDouble
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.site-map {
  width: 18rem;
  padding: 1rem;
  background-color: $color-park-light;
  @include shadow;
}
</style>
