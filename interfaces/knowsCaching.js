import { mapGetters } from 'vuex'

export default {
  async fetch({ store, params }) {
    await store.dispatch('caching/cacheTopics')
  },
  computed: {
    ...mapGetters({
      topics: 'caching/topics'
    })
  }
}
