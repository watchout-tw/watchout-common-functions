<template>
<div class="passwords">
  <form @submit.prevent="updatePassword">
    <div class="form-field" v-if="requireCurrentPassword">
      <text-editor placeholder="確認現行密碼" type="password" v-model="currentPassword" :classes="['park']" :simple="true" key="currentPassword"/>
    </div>
    <div class="form-field">
      <text-editor placeholder="新密碼" type="password" v-model="newPassword" :classes="['park']" :simple="true" key=""/>
    </div>
    <div class="form-field">
      <text-editor placeholder="確認新密碼" type="password" v-model="newPasswordConfirmation" :classes="['park']" :simple="true" key="Confirmation"/>
    </div>
    <div class="form-field with-double-top-margin">
      <submit-button type="submit" :classes="['park']" label="變更密碼" :state.sync="state" :message.sync="message" @success="onSubmitSuccess" @failed="onSubmitFailed" />
    </div>
  </form>
</div>
</template>

<script>
import * as core from '../lib/core'
import * as STATES from '../lib/states'
import { knowsError } from '../interfaces'
import TextEditor from './TextEditor'
import SubmitButton from './button/Submit'

export default {
  mixins: [knowsError],
  props: ['requireCurrentPassword', 'data'],
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
    updatePassword() {
      if(this.requireCurrentPassword && !this.currentPassword) {
        this.state = STATES.FAILED
        this.message = '請確認現行密碼'
      } else if(!this.newPassword) {
        this.state = STATES.FAILED
        this.message = '請輸入新密碼'
      } else if(this.newPassword !== this.newPasswordConfirmation) {
        this.state = STATES.FAILED
        this.message = '新密碼兩次不一致'
      } else {
        this.state = STATES.LOADING
        let request = this.requireCurrentPassword ? core.updatePassword({
          password: this.currentPassword,
          new_password: this.newPassword
        }) : core.resetPassword({
          new_password: this.newPassword
        }, this.data.token)

        request.then(response => {
          this.state = STATES.SUCCESS
          this.message = '密碼已更新；請重新登入'
        }).catch(error => {
          this.state = STATES.FAILED
          this.message = this.humanizeError(error)
          this.currentPassword = this.newPassword = this.newPasswordConfirmation = null
          this.handleError(error)
        })
      }
    },
    reset() {
      this.currentPassword = this.newPassword = this.newPasswordConfirmation = null
    },
    onSubmitSuccess() {
      this.reset()
      this.$emit('success')
    },
    onSubmitFailed() {
      this.reset()
      this.$emit('failed')
    }
  },
  components: {
    TextEditor,
    SubmitButton
  }
}
</script>
