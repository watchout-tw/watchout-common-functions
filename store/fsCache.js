export const state = () => ({
  authors: [],
  tags: []
})

export const mutations = {
  setAuthors(state, authors) {
    state.authors = []
    state.authors.push(...authors)
  },
  setTags(state, tags) {
    state.tags = []
    state.tags.push(...tags)
  }
}
