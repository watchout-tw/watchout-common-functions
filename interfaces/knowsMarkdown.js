import marked from 'marked'
const sanitizer = require('sanitize-html')
const minSanitizationOptions = {
  allowedTags: false,
  allowedAttributes: false,
  transformTags: {
    'a': sanitizer.simpleTransform('a', { target: '_blank' })
  }
}
const maxSanitizationOptions = Object.assign({}, minSanitizationOptions, {
  allowedTags: [
    'b',
    'i',
    'em',
    'strong',
    'strike',
    'code',
    'pre',
    'blockquoe',
    'p',
    'ul',
    'ol',
    'li'
  ]
})

export default {
  methods: {
    markdown(str) {
      let result = ''
      if(typeof str === 'string') {
        str = str.trim()
        result = sanitizer(marked(str), minSanitizationOptions)
      }
      return result
    },
    minimalMarkdown(str) {
      let result = ''
      if(typeof str === 'string') {
        str = str.trim()
        result = sanitizer(marked(str), maxSanitizationOptions)
      }
      return result
    }
  }
}
