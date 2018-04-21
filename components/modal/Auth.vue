<template>
<div class="modal auth">
  <div class="title">
    <h2>進入沃草共有地</h2>
  </div>
  <div class="action" v-if="data.joinOrLogin === 'join'">
    <form onkeypress="return event.keyCode != 13;">
      <div class="field with-button">
        <input type="text" name="id" placeholder="草民代號" v-model="credentials.join.handle" />
        <button class="button small park" @click.prevent="generateHandle">隨機</button>
      </div>
      <div class="font-size-smaller text-color-nice-grey">草民代號是你在沃草共有地的身份識別，無法更改，請謹慎選擇。你可以使用A-Z、a-z（大小寫不同）、0-9、底線（_）以及連字號（-）。</div>
      <div class="field">
        <input type="email" name="email" placeholder="Email" v-model="credentials.join.email" />
      </div>
      <div class="field">
        <input type="password" name="password" placeholder="密碼" v-model="credentials.join.password" />
      </div>
      <div class="field">
        <label class="form-input-check-label"><input type="checkbox" class="park" v-model="credentials.join.iAgree"><span>我同意</span><a class="a-text" href="https://documents.watchout.tw/watchout-commons/terms-of-service/" target="_blank">使用條款</a></label>
      </div>
      <div class="field">
        <submit-button :classes="['park']" label="註冊" :state.sync="states.join" :message.sync="states.message" @click.native="join" />
      </div>
    </form>
    <div class="the-other-action text-align-right">
      <a class="a-text" href="#" @click.stop.prevent="updateModal({ id: 'auth', joinOrLogin: 'login' })">點這裡登入</a>
    </div>
  </div>
  <div class="action" v-if="data.joinOrLogin === 'login'">
    <form @keyup.13="login">
      <div class="field">
        <input type="text" name="account" placeholder="草民代號或Email" v-model="credentials.login.account" />
      </div>
      <div class="field">
        <input type="password" name="password" placeholder="密碼" v-model="credentials.login.password" />
      </div>
      <div class="field with-extra-margin">
        <submit-button :classes="['park']" label="登入" :state.sync="states.login" :message.sync="states.message" @click.native="login" />
      </div>
    </form>
    <div class="the-other-action text-align-right">
      <a class="a-block" href="#" @click.stop.prevent="addModal({ id: 'emailer', action: EMAILER_ACTIONS.REQ_EMAIL_VERIF })"><span class="a-target">重發認證信</span></a>
      <a class="a-block" href="#" @click.stop.prevent="addModal({ id: 'emailer', action: EMAILER_ACTIONS.REQ_PWD_RESET })"><span class="a-target">忘記密碼</span></a>
      <a class="a-block" href="#" @click.stop.prevent="updateModal({ id: 'auth', joinOrLogin: 'join' })"><span class="a-target">點這裡註冊</span></a>
    </div>
  </div>
</div>
</template>

<script>
import * as core from '../../lib/core'
import * as EMAILER_ACTIONS from '../../lib/emailer_actions'
import * as ERRORS from '../../lib/errors'
import * as STATES from '../../lib/states'
import * as util from '../../lib/util'
import { knowsAuth, knowsWindowManagement } from '../../interfaces'
import SubmitButton from '../button/Submit.vue'

const nameGenerator = require('project-name-generator')

export default {
  mixins: [knowsAuth, knowsWindowManagement],
  props: ['data'],
  data() {
    return {
      credentials: {
        join: {
          handle: null,
          email: null,
          password: null,
          iAgree: false
        },
        login: {
          account: null,
          password: null
        }
      },
      states: {
        join: STATES.DEFAULT,
        login: STATES.DEFAULT,
        message: null
      },
      EMAILER_ACTIONS
    }
  },
  methods: {
    join() {
      if(this.states.join === STATES.DEFAULT && this.credentials.join.handle && this.credentials.join.email && this.credentials.join.password && this.credentials.join.iAgree) {
        this.states.join = STATES.LOADING
      } else {
        this.states.join = STATES.FAILED
        this.states.message = '資料不完整'
      }
    },
    login() {
      if(this.states.login === STATES.DEFAULT && this.credentials.login.account && this.credentials.login.password) {
        var data = util.isEmail(this.credentials.login.account)
          ? { email: this.credentials.login.account }
          : { handle: this.credentials.login.account }
        data.password = this.credentials.login.password
        this.states.login = STATES.LOADING

        core.login(data).then(response => {
          this.setAuth(response.data)
          // this.loginSuccessful = true
          this.states.login = STATES.SUCCESS
          this.states.message = '歡迎回來'
          this.removeModalAfter('auth', 2000)
        }).catch(error => {
          let message = error.response.data.message
          console.error(error, error.response, message)
          this.states.login = STATES.FAILED
          this.states.message = ERRORS.MAP[message]
        })
      } else {
        this.states.login = STATES.FAILED
        this.states.message = '資料不完整'
      }
    },
    generateHandle() {
      this.credentials.join.handle = nameGenerator({ words: Math.ceil(Math.random() * 2) + 1 }).raw.join('_')
    }
  },
  components: {
    SubmitButton
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
