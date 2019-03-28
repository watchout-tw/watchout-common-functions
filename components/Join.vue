<template>
<form @submit.prevent="join">
  <div class="form-field-many-inputs no-wrap">
    <text-editor placeholder="草民代號" v-model="handle" :classes="['park']" :simple="true" key="joinHandle" />
    <button type="button" class="button small park" @click.prevent="generateHandle">隨機</button>
  </div>
  <div class="font-size-small text-color-nice-grey">草民代號是你在沃草共有地的獨特身份識別，無法更改，請謹慎選擇。你可以使用A-Z、a-z、0-9、_、-。</div>
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

const nameGenerator = require('project-name-generator')

export default {
  mixins: [knowsAuth, knowsError],
  data() {
    return {
      handle: null,
      email: null,
      password: null,
      iAgree: false,
      state: STATES.DEFAULT,
      message: null
    }
  },
  methods: {
    generateHandle() {
      this.handle = nameGenerator({ words: Math.ceil(Math.random() * 2) + 1 }).raw.join('_')
    },
    join() {
      if(this.state === STATES.DEFAULT && this.handle && this.email && this.password && this.iAgree) {
        if(util.isEmail(this.email)) {
          this.state = STATES.LOADING
          core.join({
            handle: this.handle,
            email: this.email,
            password: this.password
          }).then(response => {
            this.state = STATES.SUCCESS
            this.message = '認證信已寄出'
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
