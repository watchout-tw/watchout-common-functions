import { env } from 'watchout-common-assets'
import { statuses, publishDestinations, getPubDest, authorTypes, spacingOptimizer } from 'watchout-common-functions/lib/bunko'

export default {
  data() {
    return {
      bunkoBaseURL: env.links.bunko.beta,
      statuses,
      publishDestinations,
      authorTypes
    }
  },
  methods: {
    getPubDest,
    isPublished(doc) {
      return doc.publishedFrom === 'firestore'
    },
    spacingOptimizer
  }
}
