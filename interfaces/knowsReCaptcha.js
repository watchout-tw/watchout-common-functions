import config from 'watchout-common-functions/config/config'

export default {
  data() {
    return {
      isInvisible: config.reCaptchaType === 'invisible'
    }
  }
}
