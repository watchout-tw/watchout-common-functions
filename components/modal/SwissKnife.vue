<template>
<div class="modal swiss-knife">
  <div class="self">
    <avatar :show="['avatar', 'name', 'identity']" :persona="activePersona" :classes="['horizontal']" :parties="parties" :citizen="citizenObj" />
  </div>
  <div class="actions">
<!--    <a class="action" :href="activePersona ? getParkPersonaProfileURL(activePersona.id) : '#'">個人檔案</a>-->
<!--    <a class="action" :href="getParkSettingsURL()">變更設定</a>-->
<!--    <a class="action" @click="switchPersona" v-if="personas && personas.length > 1">切換身分</a>-->
    <a class="action" v-show="data.memberInfoEditable" :href="getWatchoutMemberInfoURL()">個人資料</a>
    <a class="action" @click="logoutAndRemoveModal">登出</a>
  </div>
</div>
</template>

<script>
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'
import * as core from 'watchout-common-functions/lib/core'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['parties', 'data'],
  data() {
    return {
      citizenObj: null
    }
  },
  beforeMount() {
    core.getCitizen().then(response => {
      this.citizenObj = response.data
    })
  },
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
