import { mapGetters } from 'vuex'

export default {
  async fetch({ store, params }) {
    await Promise.all([
      store.dispatch('caching/cacheTopics'),
      store.dispatch('caching/cacheParties'),
      store.dispatch('caching/cacheAuthors')
    ])
  },
  computed: {
    ...mapGetters({
      cachedTopics: 'caching/topics',
      cachedParties: 'caching/parties',
      cachedAuthors: 'caching/authors'
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
    cachedAuthorByContent(type, id) {
      return this.cachedAuthors.find(author => author.content.id === id)
    }
  }
}
