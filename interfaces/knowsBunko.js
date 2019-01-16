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
    }
  }
}
