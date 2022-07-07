<template>
<form @submit.prevent="join">
  <div class="form-field">
    <text-editor placeholder="Email" type="email" v-model="email" :classes="['park']" :simple="true" key="joinEmail" />
  </div>
  <div class="form-field">
    <text-editor placeholder="密碼" type="password" v-model="password" :classes="['park']" :simple="true" key="joinPassword" />
  </div>
  <div class="form-field">
    <label class="form-input-check-label"><input type="checkbox" class="park" v-model="iAgree"><span>我同意<a class="a-text" href="https://documents.watchout.tw/watchout-commons/terms-of-service/" target="_blank">使用條款</a></span></label>
  </div>
  <div class="form-field margin-top-8">
    <submit-button type="submit" :classes="['park']" label="註冊" :state.sync="state" :message.sync="message" @success="onSubmitSuccess" @failed="onSubmitFailed" />
  </div>
</form>
</template>

<script>
import * as util from 'watchout-common-functions/lib/util'
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
      iAgree: false,
      state: STATES.DEFAULT,
      message: null
    }
  },
  methods: {
    join() {
      if(this.state === STATES.DEFAULT && this.email && this.password && this.iAgree) {
        if(util.isEmail(this.email)) {
          this.state = STATES.LOADING
          core.join({
            email: this.email,
            password: this.password
          }).then(response => {
            this.state = STATES.SUCCESS
          }).catch(error => {
            this.state = STATES.FAILED
            this.message = this.humanizeError(error)
            this.handleError(error)
          })
        } else {
          this.state = STATES.FAILED
          this.message = '這不是Email'
        }
      } else {
        this.state = STATES.FAILED
        this.message = '資料不完整'
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
