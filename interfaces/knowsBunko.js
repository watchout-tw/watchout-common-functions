import { publishDestinations, getPubDest, getPubDestFromContent } from 'watchout-common-functions/lib/bunko'

export default {
  data() {
    return {
      publishDestinations
    }
  },
  methods: {
    getPubDest,
    getPubDestFromContent,
    isPublished(doc) {
      return doc.publishedFrom === 'firestore'
    }
  }
}
