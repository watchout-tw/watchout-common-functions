<template>
<div class="modal swiss-knife">
  <div class="self">
    <avatar :show="['avatar', 'name', 'identity']" :persona="activePersona" :classes="['horizontal']" :parties="parties" />
  </div>
  <div class="actions">
    <a class="action" :href="activePersona ? getParkPersonaProfileURL(activePersona.id) : '#'">個人檔案</a>
    <a class="action" :href="getParkSettingsURL()">變更設定</a>
    <a class="action" @click="switchPersona" v-if="personas.length > 1">切換身分</a>
    <a class="action" @click="logoutAndRemoveModal">登出</a>
  </div>
</div>
</template>

<script>
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'
export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['parties'],
  methods: {
    switchPersona() {
      this.addModal('persona-switcher')
    },
    logoutAndRemoveModal() {
      this.logout()
      this.removeModal('swiss-knife')
    }
  },
  components: {
    Avatar
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
