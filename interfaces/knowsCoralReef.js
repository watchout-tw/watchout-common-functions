export default {
  data() {
    return {
      crToken: null,
      crTokenSource: null
    }
  },
  mounted() {
    this.crUpdate()
  },
  watch: {
    isCitizen() {
      this.crUpdate()
    },
    crToken() {
      this.crUpdate()
    }
  },
  methods: {
    crUpdate() {
      if(this.isCitizen) {
        this.crToken = this.getTokenCookie()
        this.crTokenSource = 'watchout'
      } else if(this.crToken) {
        this.crTokenSource = 'recaptcha'
      }
    }
  }
}
