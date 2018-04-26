import marked from 'marked'

export default {
  methods: {
    markdown(str) {
      str = str.trim()
      return (str !== '' && str !== null && str !== undefined) ? marked(str) : ''
    }
  }
}
