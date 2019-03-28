<template>
<div class="role-card bg-park-light">
  <div class="secondary-text font-size-small">目前權限</div>
  <div>{{ roleText }}</div>
</div>
</template>

<script>
import { knowsAuth } from 'watchout-common-functions/interfaces'
import * as ROLES from 'watchout-common-functions/lib/roles'

export default {
  mixins: [knowsAuth],
  computed: {
    roleText() {
      let text = '路人'
      if(this.isLocal() && Array.isArray(this.roles)) {
        if(this.hasRole(ROLES.WITH_INFO)) {
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
}
</style>
