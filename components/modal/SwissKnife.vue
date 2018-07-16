<template>
<div class="modal swiss-knife">
  <div class="self">
    <avatar-self :show="['avatar', 'name']" :classes="['horizontal']" />
  </div>
  <div class="actions">
    <a class="action" :href="activePersona ? getParkPersonaProfileURL(activePersona.id) : '#'">個人檔案</a>
    <a class="action" :href="getParkSettingsURL()">變更設定</a>
    <a class="action" @click="logoutAndRemoveModal">登出</a>
  </div>
</div>
</template>

<script>
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import AvatarSelf from 'watchout-common-functions/components/AvatarSelf'
export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  methods: {
    logoutAndRemoveModal() {
      this.logout()
      this.removeModal('swiss-knife')
    }
  },
  components: {
    AvatarSelf
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.swiss-knife {
  width: 18rem;
  background-color: $color-park-light;
  @include shadow;
  > .self {
    padding: 0.5rem;
    font-weight: bold;
    background-color: $color-park-light;
  }
  > .actions {
    > .action {
      display: block;
      padding: 1rem;
    }
  }
}
</style>
