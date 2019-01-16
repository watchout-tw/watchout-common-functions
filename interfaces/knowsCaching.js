import { mapGetters } from 'vuex'
import { parseReference } from 'watchout-common-functions/lib/bunko'

export default {
  async fetch({ store, params }) {
    await Promise.all([
      store.dispatch('caching/cacheTopics'),
      store.dispatch('caching/cacheParties'),
      store.dispatch('caching/cacheAuthors'),
      store.dispatch('caching/cacheTags')
    ])
  },
  computed: {
    ...mapGetters({
      cachedTopics: 'caching/topics',
      cachedParties: 'caching/parties',
      cachedAuthors: 'caching/authors',
      cachedTags: 'caching/tags'
    })
  },
  methods: {
    cachedTopic(id) {
      return this.cachedTopics.find(topic => topic.id === id)
    },
    cachedParty(id) {
      return this.cachedParties.find(party => party.id === id)
    },
    cachedAuthor(id) {
      return this.cachedAuthors.find(author => author.id === id)
    },
    cachedAuthorByPersona(personaID) {
      return this.cachedAuthors.find(author => author.persona === personaID)
    },
    cachedAuthorByContent(type, id) {
      return this.cachedAuthors.find(author => {
        let ref = parseReference(author.reference)
        return ref.type === type && ref.id === id
      })
    },
    cachedTag(id) {
      return this.cachedTags.find(tag => tag.id === id)
    }
  }
}
