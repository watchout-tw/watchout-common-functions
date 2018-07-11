<template>
<div class="role-card">
  <div class="secondary-text font-size-small">目前角色</div>
  <div>{{ roleText }}</div>
</div>
</template>

<script>
import { knowsAuth } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsAuth],
  computed: {
    roleText() {
      let text = '路人'
      if(this.isLocal() && Array.isArray(this.roles)) {
        if(this.hasRole(null, 'with_info')) {
          text = '大草民'
        } else {
          text = '草民'
        }
      }
      return text
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.role-card {
  padding: 0.75rem;
  background-color: $color-park-light;
}
</style>
