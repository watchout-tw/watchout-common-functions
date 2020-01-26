<template>
<div class="recaptcha-outer-container">
  <no-ssr><div class="recaptcha-inner-container">
    <div class="recaptcha" v-if="!token && initialized" :style="isInvisible ? {visibility: 'hidden', width: 0, height: 0}: {}">
      <div id="recaptcha-placeholder" class="g-recaptcha"></div>
    </div>
    <div class="font-size-small secondary-text">透過《沃草共有地》，我們希望更了解大家在想些什麼。你在這個頁面的各種行為將被紀錄，《沃草》會用這些寶貴的資料做出更多作品，刺激思考，促進對話。</div>
    <div class="recaptcha-text font-size-small secondary-text">
      <img :src="require('watchout-common-assets/images/attributions/recaptcha.svg')" v-if="tokenSource !== 'watchout'" />
      <div>
        <span v-if="tokenSource !== 'watchout'">你尚未登入。</span>
        <template v-if="tokenSource !== 'watchout'"><a class="a-text" @click.prevent="addModal({ id: 'auth', joinOrLogin: 'login' })">按這裡登入</a><span>，把你的參與紀錄下來。</span></template>
        <template v-if="!token"><span>未登入的你，有可能會收到</span><span class="latin-within-han">reCAPTCHA</span><span>的挑戰。</span></template>
      </div>
    </div>
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
  beforeMount() { // FIXME: dirty
    // set handler
    window.reCaptchaIsLoaded = () => {
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

    // add script
    let scriptIDKey = 'data-hid'
    let scriptIDValue = 'grecaptcha'
    if(!document.head.querySelector(`[${scriptIDKey}=${scriptIDValue}]`)) {
      let scriptEl = document.createElement('script')
      scriptEl.setAttribute(scriptIDKey, scriptIDValue)
      scriptEl.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=reCaptchaIsLoaded&render=explicit')
      scriptEl.setAttribute('async', '')
      scriptEl.setAttribute('defer', '')
      document.head.appendChild(scriptEl)
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
.recaptcha-outer-container {
  > .recaptcha-inner-container {
    > .recaptcha-text {
      display: flex;
      align-items: center;
      > img {
        width: 4rem;
        height: 4rem;
        flex-shrink: 0;
      }
    }
  }
}
</style>
