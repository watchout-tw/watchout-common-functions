import * as core from '../lib/core'

export const state = () => ({
  topics: []
})

export const actions = {
  async cacheTopics({ commit }) {
    let topics = await core.getTopics()
    commit('cacheTopics', topics.data.rows)
  }
}

export const mutations = {
  cacheTopics(state, value) {
    state.topics = value
  }
}

export const getters = {
  topics(state) {
    return state.topics
  }
}
