import marked from 'marked'

export default {
  methods: {
    markdown(str) {
      return marked(str)
    }
  }
}
