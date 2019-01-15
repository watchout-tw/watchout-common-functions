import { publishDestinations, getPubDest } from 'watchout-common-functions/lib/bunko'

export default {
  data() {
    return {
      publishDestinations
    }
  },
  methods: {
    getPubDest,
    isPublished(doc) {
      return doc.publishedFrom === 'firestore'
    }
  }
}
