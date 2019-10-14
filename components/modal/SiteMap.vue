<template>
<div class="modal site-map" :class="channelID">
  <div class="section-title with-underline small text-align-center margin-bottom-4"><span>菜單</span></div>
  <menu-double :menu="data.menu" @itemClicked="removeModal('site-map')" />
</div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import MenuDouble from 'watchout-common-functions/components/MenuDouble'
export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  computed: {
    channelID() {
      return this.data && this.data.channel && this.data.channel.id ? this.data.channel.id : 'watchout'
    }
  },
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
  background-color: rgba($color-watchout, 0.5);
  @include shadow;
  &.musou {
    background-color: rgba($color-musou, 0.5);
  }
  &.uc {
    background-color: rgba($color-uc, 0.5);
  }
  &.ask {
    background-color: rgba($color-ask, 0.5);
  }
  &.park {
    background-color: rgba($color-park, 0.5);
  }
}
</style>
