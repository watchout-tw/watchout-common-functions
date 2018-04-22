<template>
<div class="passwords">
  <div class="form">
    <div class="field" v-if="!isResetMode">
      <text-editor placeholder="確認現行密碼" type="password" v-model="currentPassword" :classes="['park']" :simple="true" key="currentPassword"/>
    </div>
    <div class="field">
      <text-editor placeholder="新密碼" type="password" v-model="newPassword" :classes="['park']" :simple="true" key=""/>
    </div>
    <div class="field">
      <text-editor placeholder="確認新密碼" type="password" v-model="newPasswordConfirmation" :classes="['park']" :simple="true" key="Confirmation"/>
    </div>
    <div class="field with-extra-margin">
      <submit-button :classes="['park']" label="變更密碼" :state.sync="state" :message.sync="message" @click.native="send" @reset="onSubmitButtonReset" />
    </div>
  </div>
</div>
</template>

<script>
import * as core from '../lib/core'
import * as ERRORS from '../lib/errors'
import * as STATES from '../lib/states'
import { knowsAuth } from '../interfaces'
import TextEditor from './TextEditor'
import SubmitButton from './button/Submit'

export default {
  mixins: [knowsAuth],
  props: ['isResetMode'],
  data() {
    return {
      currentPassword: null,
      newPassword: null,
      newPasswordConfirmation: null,
      state: STATES.DEFAULT,
      message: null
    }
  },
  methods: {
    send() {
      if(this.isResetMode) {
        this.resetPassword()
      }else {
        this.updatePassword()
      }
    },
    resetPassword() {
      if(this.newPassword !== this.newPasswordConfirmation) {
        this.state = STATES.FAILED
        this.message = '新密碼兩次不一致'
      } else {
        core.resetPassword({
          new_password: this.newPassword
        }, this.$route.query.token).then(response => {
          console.log(response)
          this.state = STATES.SUCCESS
          this.message = '密碼已更新；請重新登入'
        }).catch(error => {
          let message = error.response.data.message
          this.state = STATES.FAILED
          this.message = ERRORS.MAP[message]
        })
      }
    },
    updatePassword() {
      if(!this.currentPassword) {
        this.state = STATES.FAILED
        this.message = '請確認現行密碼'
      } else if(!this.newPassword) {
        this.state = STATES.FAILED
        this.message = '請輸入新密碼'
      } else if(this.newPassword !== this.newPasswordConfirmation) {
        this.state = STATES.FAILED
        this.message = '新密碼兩次不一致'
      } else {
        core.updatePassword({
          password: this.currentPassword,
          new_password: this.newPassword
        }).then(response => {
          console.log(response)
          this.state = STATES.SUCCESS
          this.message = '密碼已更新；請重新登入'
        }).catch(error => {
          let message = error.response.data.message
          this.state = STATES.FAILED
          this.message = ERRORS.MAP[message]
        })
      }
    },
    onSubmitButtonReset() {
      if(this.state === STATES.FAILED) {
        this.currentPassword = this.newPassword = this.newPasswordConfirmation = null
      } else if(this.state === STATES.SUCCESS) {
        this.logout()
      }
    }
  },
  components: {
    TextEditor,
    SubmitButton
  }
}
</script>
