export const state = () => ({
  isCitizen: false,
  citizenID: null,
  handle: null,
  albumID: null,
  personaID: null,
  personas: [],
  roles: []
})

export const actions = {
  toggle({ commit }, value) {
    commit('toggle', value)
  }
}

export const mutations = {
  toggle(state, value) {
    const test = (value) => value !== null && typeof value === 'object'
    state.isCitizen = test(value)
    state.citizenID = test(value) ? value.citizen_id : null
    state.handle = test(value) ? value.handle : null
    state.albumID = test(value) ? value.album_id : null
    state.personaID = test(value) ? parseInt(value.persona_id) : null
    state.personas = test(value) ? value.personas : null
    state.roles = test(value) ? value.roles : null
  }
}

export const getters = {
  isCitizen(state) {
    return state.isCitizen
  },
  citizen(state) {
    return {
      id: state.citizenID,
      handle: state.handle,
      albumID: state.albumID
    }
  },
  personaID(state) {
    return state.personaID
  },
  personas(state) {
    return state.personas
  },
  roles(state) {
    return state.roles
  }
}
