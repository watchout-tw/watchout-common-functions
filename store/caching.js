import * as core from 'watchout-common-functions/lib/core'

export const state = () => ({
  topics: [],
  parties: [],
  reps: [],
  caucuses: [],
  gov_agencies: [],
  legislative_steps: []
})

export const actions = {
  async cacheTopics({ commit }) {
    let topics = await core.getTopics()
    commit('cacheTopics', topics.data.rows)
  },
  async cacheParties({ commit }) {
    let parties = await core.getParties()
    commit('cacheParties', parties.data.rows.map(row => Object.assign(row, { code: row.emblem, colors: [row.color] })))
  },
  async cacheReps({ commit }) {
    let reps = await core.getReps()
    commit('cacheReps', reps.data.rows)
  },
  async cacheCaucuses({ commit }) {
    let caucuses = await core.getCaucuses()
    commit('cacheCaucuses', caucuses.data.rows)
  },
  async cacheGovAgencies({ commit }) {
    let govAgencies = await core.getGovAgencies()
    commit('cacheGovAgencies', govAgencies.data.rows)
  },
  async cacheLegislativeSteps({ commit }) {
    let legislativeSteps = await core.getLegislativeSteps()
    commit('cacheLegislativeSteps', legislativeSteps.data.rows)
  }
}

export const mutations = {
  cacheTopics(state, value) {
    state.topics = value
  },
  cacheParties(state, value) {
    state.parties = value
  },
  cacheReps(state, value) {
    state.reps = value
  },
  cacheCaucuses(state, value) {
    state.caucuses = value
  },
  cacheGovAgencies(state, value) {
    state.gov_agencies = value
  },
  cacheLegislativeSteps(state, value) {
    state.legislative_steps = value
  }
}

export const getters = {
  topics(state) {
    return state.topics
  },
  parties(state) {
    return state.parties
  },
  reps(state) {
    return state.reps
  },
  caucuses(state) {
    return state.caucuses
  },
  govAgencies(state) {
    return state.gov_agencies
  },
  legislativeSteps(state) {
    return state.legislative_steps
  }
}
