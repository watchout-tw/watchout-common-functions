<template>
<div class="re-captcha" style="display: none;">
  <div id="recaptcha-placeholder" class="g-recaptcha"></div>
  <script src="https://www.google.com/recaptcha/api.js?onload=reCaptchaIsLoaded&render=explicit" async defer></script>
</div>
</template>

<script>
import config from '../config/config'

const SIZE = 'invisible'
export default {
  props: ['verified', 'token', 'callback'],
  beforeMount() {
    window.reCaptchaIsLoaded = () => { // FIXME: a little dirty but ok
      console.log('reCAPTCHA is loaded...')
      window.grecaptcha.render('recaptcha-placeholder', {
        sitekey: config.reCaptchaSiteKey,
        size: SIZE,
        callback: self.verifiedCallback
      })
    }
  },
  methods: {
    verifiedCallback(token) {
      this.$emit('update:token', token)
      this.$emit('update:verified', true)
      if(typeof this.callback === 'function') this.callback()
    }
  }
}
</script>
