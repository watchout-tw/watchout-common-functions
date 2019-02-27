import marked from 'marked'
const sanitizer = require('sanitize-html')
const minSanitizationOptions = {
  allowedTags: false,
  allowedAttributes: false,
  transformTags: {
    'a': sanitizer.simpleTransform('a', { target: '_blank' })
  }
  // FIXME: spacing optimization of <h2> & <h3> should be done here
  // NOTE: replacing text with transformTags is buggy
  // https://github.com/punkave/sanitize-html/issues/136
}
const sansHTMLSanitizationOptions = {
  allowedTags: [],
  allowedAttributes: {}
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
    'blockquote',
    'p',
    'ul',
    'ol',
    'li'
  ],
  allowedAttributes: sanitizer.defaults.allowedAttributes
})

export default {
  methods: {
    markdown(str, removeHTMLFirst = false) {
      let result = ''
      if(typeof str === 'string') {
        str = str.trim()
        if(removeHTMLFirst) {
          str = sanitizer(str, sansHTMLSanitizationOptions)
        }
        result = sanitizer(marked(str), minSanitizationOptions)
      }
      return result
    },
    minimalMarkdown(str, removeHTMLFirst = false) {
      let result = ''
      if(typeof str === 'string') {
        str = str.trim()
        if(removeHTMLFirst) {
          str = sanitizer(str, sansHTMLSanitizationOptions)
        }
        result = sanitizer(marked(str), maxSanitizationOptions)
      }
      return result
    }
  }
}
