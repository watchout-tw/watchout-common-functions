import { mapGetters } from 'vuex'
import { parseReference } from 'watchout-common-functions/lib/watchout'

export default {
  async fetch({ store, params }) {
    await Promise.all([
      store.dispatch('caching/cacheTopics'),
      store.dispatch('caching/cacheTags'),
      store.dispatch('caching/cacheAuthors'),
      store.dispatch('caching/cacheParties')
    ])
  },
  computed: {
    ...mapGetters({
      cachedTopics: 'caching/topics',
      cachedAuthors: 'caching/authors',
      cachedTags: 'caching/tags',
      cachedParties: 'caching/parties'
    }),
    // FIXME: putting these here are a bit weird
    // FIXME: copy to knowsBunko
    authorOptions() {
      return Array.isArray(this.cachedAuthors) ? this.cachedAuthors.map(author => ({ value: author.persona, label: (author.personaObj ? author.personaObj.name : author.persona) })) : []
    },
    tagOptions() {
      return Array.isArray(this.cachedTags) ? this.cachedTags.map(tag => ({ value: tag.id, label: tag.title })) : []
    }
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
    cachedTag(id) {
      return this.cachedTags.find(tag => tag.id === id)
    },
    cachedAuthorByPersona(personaID) {
      return this.cachedAuthors.find(author => author.persona === personaID)
    },
    cachedAuthorNameByPersona(personaID) {
      let author = this.cachedAuthorByPersona(personaID)
      return author && author.personaObj ? author.personaObj.name : personaID
    },
    cachedAuthorByContent(type, id) {
      let cachedAuthor = this.cachedAuthors.find(author => {
        let ref = parseReference(author.reference)
        return ref.type === type && ref.id === id
      })
      return cachedAuthor ? cachedAuthor : false
    },
    cachedAuthorNameByContent(type, id) {
      let author = this.cachedAuthorByContent(type, id)
      return author && author.personaObj ? author.personaObj.name : author.persona
    }
  }
}
