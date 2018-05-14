<template>
<div class="modal private-info-registration">
  <h2>完整註冊資料</h2>
  <div class="paragraphs first font-size-smaller">
    <p>這個功能需要填寫完整的基本資料。</p>
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
