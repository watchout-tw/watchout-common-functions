<template>
<div class="modal private-info-registration">
  <div class="title">
    <h2>重設密碼</h2>
  </div>
  <passwords :is-reset-mode="true" />
</div>
</template>

<script>
import Passwords from '../Passwords.vue'

export default {
  components: {
    Passwords
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
