<template>
<div class="modal auth">
  <div class="title">
    <h2>重設密碼</h2>
  </div>
  <passwords :require-current-password="false" :data="data" @success="onSuccess" />
</div>
</template>

<script>
import { knowsAuth, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import Passwords from 'watchout-common-functions/components/Passwords'
export default {
  mixins: [knowsAuth, knowsWindowManagement],
  props: ['data'],
  components: {
    Passwords
  },
  methods: {
    onSuccess() {
      this.removeModal('reset-password')
      this.logout()
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.auth {
  position: relative;
  width: 18rem;
  padding: 1rem;
  background-color: $color-park-light;
  @include shadow;
}
</style>
