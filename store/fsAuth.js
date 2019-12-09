import * as firestore from 'watchout-common-functions/lib/firestore'
import * as cookie from 'watchout-common-functions/lib/cookie'

export const state = () => ({
  currentUser: {
    uid: null,
    email: null
  },
  activePersona: {
    id: null,
    type: 'default',
    name: null,
    avatar: {
      type: 'system',
      id: 'anon'
    },
    permissions: []
  }
})

function get(obj, key, defaultValue = null) {
  return obj !== undefined && obj !== null && typeof obj === 'object' && obj[key] !== undefined ? obj[key] : defaultValue
}

export const actions = {
  async fetchActivePersona({ commit }, personaID) {
    console.info('[store] action fsAuth/fetchActivePersona', personaID)
    let persona = null
    if(personaID) {
      try {
        persona = await firestore.park.getPersona(personaID)
      } catch(error) {
        console.error(error.code, error.message)
      }
    }
    commit('setActivePersona', Object.assign({ id: personaID }, persona))
  }
}

export const mutations = {
  setCurrentUser(state, user) {
    let uid = get(user, 'uid')
    let email = get(user, 'email')
    console.info('[store] mutation fsAuth/setCurrentUser', uid, email)
    state.currentUser.uid = uid
    state.currentUser.email = email

    if(uid) { // FIXME: token
      cookie.set(uid)
    } else {
      cookie.remove()
    }
  },
  setActivePersona(state, persona) {
    console.info('[store] mutation fsAuth/setActivePersona', persona)
    state.activePersona = persona
  }
}
