<template>
<div class="recaptcha">
  <no-ssr><div class="tcl-container">
    <div class="tcl-panel tcl-left-right-margin">
      <div class="recaptcha-container" v-if="!token && initialized" :style="isInvisible ? {visibility: 'hidden', width: 0, height: 0}: {}">
        <div id="recaptcha-placeholder" class="g-recaptcha"></div>
        <script src="https://www.google.com/recaptcha/api.js?onload=reCaptchaIsLoaded&render=explicit" async defer></script>
      </div>
      <div class="font-size-small secondary-text">藉由《媒體實驗》，我們希望更了解台灣人在想什麼。你在這個頁面的操作將被紀錄，我們會用這些寶貴的資料做出更多作品，刺激思考，促進對話。</div>
      <div class="recaptcha-text font-size-small secondary-text">
        <img :src="require('watchout-common-assets/images/attributions/recaptcha.svg')" v-if="tokenSource !== 'watchout'" />
        <div>
          <span v-if="tokenSource !== 'watchout'">你尚未登入。</span>
          <template v-if="tokenSource !== 'watchout'"><a class="a-text" @click.prevent="addModal({ id: 'auth', joinOrLogin: 'login' })">按這裡登入</a><span>，紀錄你參與過的《媒體實驗》。</span></template>
          <template v-if="!token"><span>未登入的你，大概會收到</span><span class="latin-within-han">reCAPTCHA</span><span>的挑戰。</span></template>
        </div>
      </div>
    </div>
    <div class="tcl-panel"></div>
  </div></no-ssr>
</div>
</template>

<script>
import { knowsReCaptcha, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import config from 'watchout-common-functions/config/config'

export default {
  mixins: [knowsReCaptcha, knowsWindowManagement],
  props: ['token', 'tokenSource', 'callback'],
  data() {
    return {
      widgetID: null,
      initialized: false
    }
  },
  beforeMount() {
    window.reCaptchaIsLoaded = () => { // FIXME: a little dirty but ok
      console.log('reCAPTCHA is loaded...')
      let renderConfig = {
        sitekey: config.reCaptchaSiteKey,
        size: this.isInvisible ? 'invisible' : 'normal',
        callback: this.verifiedCallback
      }
      this.widgetID = window.grecaptcha.render('recaptcha-placeholder', renderConfig)
      if(this.isInvisible) {
        window.grecaptcha.execute(this.widgetID)
      }
    }
    this.initialized = true
  },
  methods: {
    verifiedCallback(token) {
      this.$emit('update:token', token)
      if(typeof this.callback === 'function') {
        this.callback()
      }
    }
  }
}
</script>

<style lang="scss">
.recaptcha {
  .recaptcha-text {
    display: flex;
    align-items: center;
    > img {
      width: 4rem;
      height: 4rem;
    }
  }
}
</style>
