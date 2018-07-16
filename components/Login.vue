<template>
<form @submit.prevent="login">
  <div class="form-field">
    <text-editor placeholder="草民代號或Email" v-model="account" :classes="['park']" :simple="true" key="loginAccount" />
  </div>
  <div class="form-field">
    <text-editor placeholder="密碼" type="password" v-model="password" :classes="['park']" :simple="true" key="loginPassword" />
  </div>
  <div class="form-field with-double-top-margin">
    <submit-button type="submit" :classes="['park']" label="登入" :state.sync="state" :message.sync="message" @reset="onSubmitButtonReset" />
  </div>
</form>
</template>

<script>
import * as util from 'watchout-common-functions/lib/util'
import * as core from 'watchout-common-functions/lib/core'
import * as ERRORS from 'watchout-common-functions/lib/errors'
import * as STATES from 'watchout-common-functions/lib/states'
import TextEditor from 'watchout-common-functions/components/TextEditor'
import SubmitButton from 'watchout-common-functions/components/button/Submit.vue'
import { knowsAuth, knowsError } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsAuth, knowsError],
  data() {
    return {
      account: null,
      password: null,
      state: STATES.DEFAULT,
      message: null
    }
  },
  methods: {
    login() {
      if(this.state === STATES.DEFAULT && this.account && this.password) {
        var data = util.isEmail(this.account) ? { email: this.account } : { handle: this.account }
        data.password = this.password
        this.state = STATES.LOADING

        core.login(data).then(response => {
          this.setAuth(response.data)
          this.state = STATES.SUCCESS
          this.message = '歡迎回來'
        }).catch(error => {
          let message = error.response.data.message
          this.state = STATES.FAILED
          this.message = ERRORS.MAP[message]
          this.handleError(error)
        })
      } else {
        this.state = STATES.FAILED
        this.message = '資料不完整'
      }
    },
    onSubmitButtonReset() {
      this.password = null
      this.state = STATES.DEFAULT
      this.message = null
      this.$emit('success')
    }
  },
  components: {
    TextEditor,
    SubmitButton
  }
}
</script>
