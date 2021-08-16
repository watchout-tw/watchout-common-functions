<template>
<div class="role-card bg-park-light">
  <div class="secondary-text font-size-small">目前權限</div>
  <div v-for="(text, index) in roleText" :key="index">
    #{{ text }}&nbsp;
  </div>
</div>
</template>

<script>
import { knowsAuth } from 'watchout-common-functions/interfaces'
import * as ROLES from 'watchout-common-functions/lib/roles'

export default {
  mixins: [knowsAuth],
  computed: {
    roleText() {
      let texts = ['路人']
      if(this.isLocal() && Array.isArray(this.roles)) {
        texts = []
        if(this.hasRole(ROLES.WITH_INFO)) {
          texts.push('大草民')
        } else {
          texts.push('草民')
        }
        if(this.hasRole(ROLES.WITH_PAYMENT)) {
          texts.push('定期定額')
        }
      }
      return texts
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
