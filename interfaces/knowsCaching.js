import { mapGetters } from 'vuex'

export default {
  async fetch({ store, params }) {
    await Promise.all([
      store.dispatch('caching/cacheTopics'),
      store.dispatch('caching/cacheParties')
    ])
  },
  computed: {
    ...mapGetters({
      cachedTopics: 'caching/topics',
      cachedParties: 'caching/parties'
    })
  },
  methods: {
    cachedTopic(id) {
      return this.cachedTopics.find(topic => topic.id === id)
    },
    cachedParty(id) {
      return this.cachedParties.find(party => party.id === id)
    }
  }
}
