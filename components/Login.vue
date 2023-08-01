<template>
<form @submit.prevent="doLogin">
  <div class="form-field">
    <text-editor placeholder="E-Mail" v-model="email" :classes="['park']" :simple="true" key="loginEmail" />
  </div>
  <div class="form-field">
    <text-editor placeholder="密碼" type="password" v-model="password" :classes="['park']" :simple="true" key="loginPassword" />
  </div>
  <div class="form-field margin-top-8">
    <submit-button type="submit" :classes="['park']" label="登入" :state.sync="submitButton.state" :message.sync="submitButton.message" @success="onSubmitSuccess" @failed="onSubmitFailed" />
  </div>
  <div class="margin-top-8 margin-bottom-4 error-message" v-show="!!errorMessage">
    * {{ errorMessage }}
  </div>
</form>
</template>

<script>
import * as core from 'watchout-common-functions/lib/core'
import * as STATES from 'watchout-common-functions/lib/states'
import TextEditor from 'watchout-common-functions/components/TextEditor'
import SubmitButton from 'watchout-common-functions/components/button/Submit.vue'
import { knowsAuth, knowsError } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsAuth, knowsError],
  data() {
    return {
      email: null,
      password: null,
      submitButton: {
        state: STATES.DEFAULT,
        message: null
      },
      errorMessage: null
    }
  },
  methods: {
    async doLogin() {
      if(this.submitButton.state === STATES.DEFAULT && this.email && this.password) {
        let data = {
          email: this.email,
          password: this.password
        }
        this.submitButton.state = STATES.LOADING
        try {
          let response = await core.login(data)
          this.setAuth(response.data)
          this.submitButton.state = STATES.SUCCESS
          this.submitButton.message = '歡迎回來'
          this.errorMessage = null
        } catch(error) {
          this.submitButton.state = STATES.FAILED
          this.submitButton.message = this.humanizeError(error)
          this.errorMessage = this.humanizeError(error)
          this.handleError(error)
        }
      }
    },
    onSubmitSuccess() {
      this.password = null
      this.$emit('success')
    },
    onSubmitFailed() {
      this.password = null
      this.$emit('failed')
    }
  },
  components: {
    TextEditor,
    SubmitButton
  }
}
</script>
