export const state = () => ({
  showSupport: true,
  modals: []
})

export const actions = {
  toggleShowSupport({ commit }, value) {
    commit('toggleShowSupport', value)
  },
  addModal({ commit }, data) {
    if(typeof data === 'string') {
      data = { id: data }
    }
    commit('addModal', data)
  },
  updateModal({ commit }, data) {
    commit('updateModal', data)
  },
  removeModal({ commit }, id) {
    commit('removeModal', id)
  }
}

export const mutations = {
  toggleShowSupport(state, value) {
    state.showSupport = value
  },
  addModal(state, data) {
    // check if modal to add is a singleton & already added
    const singletons = ['auth']
    let id = data.id
    if(singletons.includes(id) && state.modals.filter(modal => modal.id === id).length > 0) {
      return
    }
    state.modals.push(data)
  },
  updateModal(state, data) {
    const index = state.modals.findIndex(modal => modal.id === data.id)
    if(index > -1) {
      state.modals[index] = Object.assign(state.modals[index], data)
    }
  },
  removeModal(state, id) {
    const index = state.modals.findIndex(modal => modal.id === id)
    if(index > -1) {
      state.modals.splice(index, 1)
    }
  }
}

export const getters = {
  showSupport(state) {
    return state.showSupport
  },
  modals(state) {
    return state.modals
  }
}
