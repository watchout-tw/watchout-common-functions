import marked from 'marked'

export default {
  methods: {
    markdown(str) {
      let result = ''
      if(typeof str === 'string') {
        str = str.trim()
        result = marked(str)
      }
      return result
    }
  }
}
