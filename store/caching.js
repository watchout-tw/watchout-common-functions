import * as core from '../lib/core'

export const state = () => ({
  topics: [],
  parties: []
})

export const actions = {
  async cacheTopics({ commit }) {
    let topics = await core.getTopics()
    commit('cacheTopics', topics.data.rows)
  },
  async cacheParties({ commit }) {
    let parties = await core.getParties()
    commit('cacheParties', parties.data.rows.map(row => Object.assign(row, { code: row.emblem, colors: [row.color] })))
  }
}

export const mutations = {
  cacheTopics(state, value) {
    state.topics = value
  },
  cacheParties(state, value) {
    state.parties = value
  }
}

export const getters = {
  topics(state) {
    return state.topics
  },
  parties(state) {
    return state.parties
  }
}
