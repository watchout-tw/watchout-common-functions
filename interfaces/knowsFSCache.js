export default {
  computed: {
    cachedAuthors() {
      return this.$store.state.fsCache.authors
    },
    cachedTags() {
      return this.$store.state.fsCache.tags
    }
  }
}
