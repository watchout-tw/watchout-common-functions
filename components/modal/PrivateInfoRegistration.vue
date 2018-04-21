<template>
<div class="modal private-info-registration">
  <div class="title">
    <h2>完整註冊資料</h2>
  </div>
  <private-info />
</div>
</template>

<script>
import PrivateInfo from '../PrivateInfo.vue'

export default {
  components: {
    PrivateInfo
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.private-info-registration {
  position: relative;
  width: 18rem;
  padding: 1rem;
  background-color: $color-park-light;
  @include shadow;
}
</style>
