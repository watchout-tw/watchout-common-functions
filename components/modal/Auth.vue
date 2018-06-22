<template>
<div class="modal auth">
  <div class="title">
    <h2>進入沃草共有地</h2>
  </div>
  <div class="action" v-if="data.joinOrLogin === 'join'">
    <form @submit.prevent="join">
      <div class="form-field-many-inputs no-wrap">
        <text-editor placeholder="草民代號" v-model="credentials.join.handle" :classes="['park']" :simple="true" key="joinHandle" />
        <button type="button" class="button small park" @click.prevent="generateHandle">隨機</button>
      </div>
      <div class="font-size-small text-color-nice-grey">草民代號是你在沃草共有地的獨特身份識別，無法更改，請謹慎選擇。你可以使用A-Z、a-z、0-9、_、-。</div>
      <div class="form-field">
        <text-editor placeholder="Email" type="email" v-model="credentials.join.email" :classes="['park']" :simple="true" key="joinEmail" />
      </div>
      <div class="form-field">
        <text-editor placeholder="密碼" type="password" v-model="credentials.join.password" :classes="['park']" :simple="true" key="joinPassword"/>
      </div>
      <div class="form-field">
        <label class="form-input-check-label"><input type="checkbox" class="park" v-model="credentials.join.iAgree"><span>我同意<a class="a-text" href="https://documents.watchout.tw/watchout-commons/terms-of-service/" target="_blank">使用條款</a></span></label>
      </div>
      <div class="form-field with-double-top-margin">
        <submit-button type="submit" :classes="['park']" label="註冊" :state.sync="states.join" :message.sync="states.message" @reset="onSubmitButtonReset('join')" />
      </div>
    </form>
    <div class="the-other-action text-align-right">
      <a class="a-text font-weight-bold" href="#" @click.stop.prevent="switchTo('login')">我要登入</a>
    </div>
  </div>
  <div class="action" v-if="data.joinOrLogin === 'login'">
    <form @submit.prevent="login">
      <div class="form-field">
        <text-editor placeholder="草民代號或Email" v-model="credentials.login.account" :classes="['park']" :simple="true" key="loginAccount" />
      </div>
      <div class="form-field">
        <text-editor placeholder="密碼" type="password" v-model="credentials.login.password" :classes="['park']" :simple="true" key="loginPassword" />
      </div>
      <div class="form-field with-double-top-margin">
        <submit-button type="submit" :classes="['park']" label="登入" :state.sync="states.login" :message.sync="states.message" @reset="onSubmitButtonReset('login')" />
      </div>
    </form>
    <div class="the-other-action text-align-right">
      <div class="font-size-small">
        <span class="secondary-text">沒收到認證信嗎？</span>
        <a class="a-text" href="#" @click.stop.prevent="addModal({ id: 'emailer', action: EMAILER_ACTIONS.REQ_EMAIL_VERIF })">重發認證信</a>
      </div>
      <div class="font-size-small">
        <span class="secondary-text">忘記密碼了嗎？</span>
        <a class="a-text" href="#" @click.stop.prevent="addModal({ id: 'emailer', action: EMAILER_ACTIONS.REQ_PWD_RESET })"><span class="a-target">重設密碼</span></a>
      </div>
      <a class="a-block font-weight-bold" href="#" @click.stop.prevent="switchTo('join')"><span class="a-target">我要註冊</span></a>
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
import { knowsAuth, knowsError, knowsWindowManagement } from '../../interfaces'
import TextEditor from '../TextEditor'
import SubmitButton from '../button/Submit.vue'

const nameGenerator = require('project-name-generator')

export default {
  mixins: [knowsAuth, knowsError, knowsWindowManagement],
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
    switchTo(what) {
      this.states.join = this.states.login = STATES.DEFAULT
      this.states.message = null
      this.updateModal({ id: 'auth', joinOrLogin: what })
    },
    join() {
      if(this.states.join === STATES.DEFAULT && this.credentials.join.handle && this.credentials.join.email && this.credentials.join.password && this.credentials.join.iAgree) {
        if(util.isEmail(this.credentials.join.email)) {
          this.states.join = STATES.LOADING
          core.join({
            handle: this.credentials.join.handle,
            email: this.credentials.join.email,
            password: this.credentials.join.password
          }).then(response => {
            this.states.join = STATES.SUCCESS
            this.states.message = '認證信已寄出'
          }).catch(error => {
            let message = error.response.data.message
            this.states.join = STATES.FAILED
            this.states.message = ERRORS.MAP[message]
            this.handleError(error)
          })
        } else {
          this.states.join = STATES.FAILED
          this.states.message = '這不是Email'
        }
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
          this.states.login = STATES.SUCCESS
          this.states.message = '歡迎回來'
        }).catch(error => {
          let message = error.response.data.message
          this.states.login = STATES.FAILED
          this.states.message = ERRORS.MAP[message]
          this.handleError(error)
        })
      } else {
        this.states.login = STATES.FAILED
        this.states.message = '資料不完整'
      }
    },
    generateHandle() {
      this.credentials.join.handle = nameGenerator({ words: Math.ceil(Math.random() * 2) + 1 }).raw.join('_')
    },
    onSubmitButtonReset(which) {
      let state = which === 'join' ? this.states.join : this.states.login
      if(state === STATES.SUCCESS) {
        this.removeModal('auth')
      }
    }
  },
  components: {
    TextEditor,
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
