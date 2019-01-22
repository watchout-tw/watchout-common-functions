import { publishDestinations, getPubDest, authorTypes } from 'watchout-common-functions/lib/bunko'

export default {
  data() {
    return {
      publishDestinations,
      authorTypes
    }
  },
  methods: {
    getPubDest,
    isPublished(doc) {
      return doc.publishedFrom === 'firestore'
    },
    titleProcessor(text) {
      let punctuations = ['，', '。', '、', '：', '；']
      let regExp = new RegExp(`([${punctuations.join('')}]+)`, 'g')
      return text.split(regExp).map(span => regExp.test(span) ? `<span class="full-width-punctuation">${span}</span>` : `<span>${span}</span>`).join('')
    }
  }
}
