import { mapGetters } from 'vuex'

export default {
  async fetch({ store, params }) {
    await store.dispatch('caching/cacheTopics')
  },
  computed: {
    ...mapGetters({
      cachedTopics: 'caching/topics'
    })
  },
  methods: {
    cachedTopic(id) {
      return this.cachedTopics.find(topic => topic.id === id)
    }
  }
}
