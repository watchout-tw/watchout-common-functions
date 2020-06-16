import { env } from 'watchout-common-assets'
import { statuses, publishDestinations, getPubDest, authorTypes, spacingOptimizer } from 'watchout-common-functions/lib/bunko'

export default {
  data() {
    return {
      bunkoBaseURL: env.links.bunko.production,
      statuses,
      publishDestinations,
      authorTypes
    }
  },
  computed: {
    authorOptions() {
      return Array.isArray(this.cachedAuthors) ? this.cachedAuthors.map(author => ({ value: author.persona, label: (author.personaObj ? author.personaObj.name : author.persona) })) : []
    },
    tagOptions() {
      return Array.isArray(this.cachedTags) ? this.cachedTags.map(tag => ({ value: tag.id, label: tag.title })) : []
    }
  },
  methods: {
    getPubDest,
    isPublished(doc) {
      return doc.publishedFrom === 'firestore'
    },
    getArticleEditURL(id) {
      return this.bunkoBaseURL + 'ghost/#/editor/post/' + id
    },
    spacingOptimizer
  }
}
