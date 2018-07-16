<template>
<div class="modal auth">
  <div class="title">
    <h2>進入沃草共有地</h2>
  </div>
  <div class="action" v-if="data.joinOrLogin === 'join'">
    <join @success="onJoinSuccess" />
    <div class="the-other-action text-align-right">
      <a class="a-text font-weight-bold" href="#" @click.stop.prevent="updateSelf('login')">我要登入</a>
    </div>
  </div>
  <div class="action" v-if="data.joinOrLogin === 'login'">
    <login @success="onLoginSuccess" />
    <div class="the-other-action text-align-right">
      <div class="font-size-small">
        <span class="secondary-text">沒收到認證信嗎？</span>
        <a class="a-text" href="#" @click.stop.prevent="reqEmailVerif()">重發認證信</a>
      </div>
      <div class="font-size-small">
        <span class="secondary-text">忘記密碼了嗎？</span>
        <a class="a-text" href="#" @click.stop.prevent="reqPwdReset()"><span class="a-target">重設密碼</span></a>
      </div>
      <a class="a-block font-weight-bold" href="#" @click.stop.prevent="updateSelf('join')"><span class="a-target">我要註冊</span></a>
    </div>
  </div>
</div>
</template>

<script>
import * as EMAILER_ACTIONS from 'watchout-common-functions/lib/emailer_actions'
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import Join from 'watchout-common-functions/components/Join'
import Login from 'watchout-common-functions/components/Login'

export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  methods: {
    updateSelf(what) {
      this.updateModal({ id: 'auth', joinOrLogin: what })
    },
    reqEmailVerif() {
      this.addModal({ id: 'emailer', action: EMAILER_ACTIONS.REQ_EMAIL_VERIF })
    },
    reqPwdReset() {
      this.addModal({ id: 'emailer', action: EMAILER_ACTIONS.REQ_PWD_RESET })
    },
    onJoinSuccess() {
    },
    onLoginSuccess() {
      this.removeModal('auth')
    }
  },
  components: {
    Join,
    Login
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
  > .action {
    margin-top: 1rem;
    > .the-other-action {
      margin-top: 0.5rem;
    }
  }
}
</style>
