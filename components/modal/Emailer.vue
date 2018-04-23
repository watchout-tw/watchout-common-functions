<template>
<div class="modal email-verifier">
  <form>
    <div class="field">
      <text-editor placeholder="請輸入你的註冊Email" type="email" v-model="email" :classes="['park']" :simple="true" key="email" />
    </div>
    <div class="field with-extra-margin">
      <submit-button :classes="['park']" :label="label" :state.sync="state" :message.sync="message" @click.native="sendEmail" @reset="onSubmitButtonReset" />
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
          }).then(response => {
            this.state = STATES.SUCCESS
            this.message = '請收信'
          }).catch(error => {
            error = null
            this.state = STATES.SUCCESS
            this.message = '請收信'
          })
        } else if(this.data.action === EMAILER_ACTIONS.REQ_PWD_RESET) {
          core.requrestPasswordReset({
            email: this.email
          }).then(response => {
            this.state = STATES.SUCCESS
            this.message = '請收信'
          }).catch(error => {
            error = null
            this.state = STATES.SUCCESS
            this.message = '請收信'
          })
        }
      } else {
        this.state = STATES.FAILED
        this.message = '這不是Email'
      }
    },
    onSubmitButtonReset() {
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
