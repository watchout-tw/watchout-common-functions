<template>
<div class="modal email-verifier">
  <form @submit.prevent="sendEmail">
    <div class="form-field">
      <text-editor placeholder="請輸入你的註冊Email" type="email" v-model="email" :classes="['park']" :simple="true" key="email" />
    </div>
    <div class="form-field margin-top-8">
      <submit-button type="submit" :classes="['park']" :label="label" :state.sync="state" :message.sync="message" @success="onSubmitSuccess" />
    </div>
  </form>
</div>
</template>

<script>
import * as core from '../../lib/core'
import * as EMAILER_ACTIONS from '../../lib/emailer_actions'
import * as STATES from '../../lib/states'
import * as util from '../../lib/util'
import { knowsWindowManagement } from '../../interfaces'
import TextEditor from '../TextEditor'
import SubmitButton from '../button/Submit.vue'

export default {
  mixins: [knowsWindowManagement],
  props: ['data'],
  data() {
    let label
    if(this.data.action === EMAILER_ACTIONS.REQ_EMAIL_VERIF) {
      label = '寄認證信給我'
    } else if(this.data.action === EMAILER_ACTIONS.REQ_PWD_RESET) {
      label = '重設密碼'
    }
    return {
      email: null,
      label,
      state: STATES.DEFAULT,
      message: null
    }
  },
  methods: {
    sendEmail() {
      if(this.state === STATES.DEFAULT && util.isEmail(this.email)) {
        this.state = STATES.LOADING
        if(this.data.action === EMAILER_ACTIONS.REQ_EMAIL_VERIF) {
          core.requestEmailVerification({
            email: this.email
          }).then(() => {
            this.state = STATES.SUCCESS
            this.message = '請收信'
          }).catch(error => {
            this.state = STATES.FAILED
            this.message = error.response.status === 400 ? '找不到這個 Email' : '無法預期的錯誤，請與我們連絡'
          })
        } else if(this.data.action === EMAILER_ACTIONS.REQ_PWD_RESET) {
          core.requestPasswordReset({
            email: this.email
          }).then(() => {
            this.state = STATES.SUCCESS
            this.message = '請收信'
          }).catch(error => {
            const message = error.response.data.message
            const status = error.response.status
            this.state = STATES.FAILED

            if(status === 400) {
              if(message === 'CITIZEN_EMAIL_ALREADY_VERIFIED') {
                this.message = 'Email 已經驗證過了'
              } else {
                this.message = '找不到這個 Email'
              }
            } else {
              this.message = '無法預期的錯誤，請與我們連絡'
            }
          })
        }
      } else {
        this.state = STATES.FAILED
        this.message = '這不是Email'
      }
    },
    onSubmitSuccess() {
      this.removeModal('emailer')
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

.modal.email-verifier {
  position: relative;
  width: 18rem;
  padding: 1rem;
  background-color: $color-park-light;
  @include shadow;
}
</style>
