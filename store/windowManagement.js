export const state = () => ({
  showSupport: true,
  modals: [],
  joinOrLogin: 'join'
})

export const actions = {
  toggleShowSupport({ commit }, value) {
    commit('toggleShowSupport', value)
  },
  addModal({ commit }, id) {
    commit('addModal', id)
  },
  removeModal({ commit }, id) {
    commit('removeModal', id)
  },
  showJoin({ commit }) {
    commit('toggleJoinOrLogin', 'join')
  },
  showLogin({ commit }) {
    commit('toggleJoinOrLogin', 'login')
  }
}

export const mutations = {
  toggleShowSupport(state, value) {
    state.showSupport = value
  },
  addModal(state, id) {
    if(!state.modals.includes(id)) {
      state.modals.push(id)
    }
  },
  removeModal(state, id) {
    const index = state.modals.indexOf(id)
    if(index > -1) {
      state.modals.splice(index, 1)
    }
  },
  toggleJoinOrLogin(state, value) {
    state.joinOrLogin = value
  }
}

export const getters = {
  showSupport(state) {
    return state.showSupport
  },
  modals(state) {
    return state.modals
  },
  joinOrLogin(state) {
    return state.joinOrLogin
  }
}
