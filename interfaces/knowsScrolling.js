export default {
  methods: {
    tryScrollToElement(map) {
      const params = Object.keys(this.$route.query ? this.$route.query : {})
      const key = params.length > 0 ? params.shift() : null
      if(key && map.hasOwnProperty(key)) {
        let el = document.getElementById(map[key])
        if(el) {
          el.scrollIntoView(true)
        }
      }
    }
  }
}
