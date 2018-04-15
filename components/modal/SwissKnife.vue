<template>
<div class="modal swiss-knife">
  <div class="name">{{ activePersona ? activePersona.name : '沒有人' }}</div>
  <div class="actions">
    <a class="action" :href="parkBaseURL + 'profile'">個人檔案</a>
    <a class="action" :href="parkBaseURL + 'settings'">變更設定</a>
    <a class="action" @click="logoutAndRemoveModal">登出</a>
  </div>
</div>
</template>

<script>
import { knowsAuth, knowsWindowManagement } from '../../interfaces'
export default {
  mixins: [knowsAuth, knowsWindowManagement],
  computed: {
    parkBaseURL() {
      return window.location.hostname === 'localhost'
        ? '//localhost:9004/'
        : window.location.hostname.split('.')[0] === 'beta'
          ? '//beta.park.watchout.tw/'
          : '//park.watchout.tw/'
    }
  },
  methods: {
    logoutAndRemoveModal() {
      this.logout()
      this.removeModalAfter('swiss-knife', 500)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.swiss-knife {
  width: 18rem;
  background-color: $color-park-light;
  @include shadow;
  > .name {
    padding: 1rem;
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
