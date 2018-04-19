import { mapGetters } from 'vuex'
import axios from 'axios'
import * as ls from '../lib/ls'

function encodeRoles(roles) {
  return JSON.stringify(roles)
}
function decodeRoles(str) {
  return JSON.parse(str)
}
function encodePersonas(personas) {
  return JSON.stringify(personas)
}
function decodePersonas(str) {
  return JSON.parse(str)
}

export default {
  computed: {
    ...mapGetters({
      isCitizen: 'auth/isCitizen',
      citizen: 'auth/citizen',
      personaID: 'auth/personaID',
      personas: 'auth/personas',
      roles: 'auth/roles'
    }),
    activePersona() {
      return this.personaID !== null ? this.personas.find(persona => persona.id === this.personaID) : null
    }
  },
  methods: {
    isLocal() {
      return process.browser && localStorage
    },
    checkAuth() {
      if(this.isLocal()) {
        let token = localStorage.getItem(ls.TOKEN)
        let citizenID = localStorage.getItem(ls.CITIZEN_ID)
        let handle = localStorage.getItem(ls.HANDLE)
        let albumID = localStorage.getItem(ls.ALBUM_ID)
        let personaID = localStorage.getItem(ls.PERSONA_ID)
        let personas = decodePersonas(localStorage.getItem(ls.PERSONAS))
        let roles = decodeRoles(localStorage.getItem(ls.ROLES))

        if(token) { // FIXME: need a more rigorous check
          this.setAuth({
            token,
            citizen_id: citizenID,
            handle,
            album_id: albumID,
            persona_id: personaID,
            personas,
            roles
          })
        }
      }
    },
    setAuth(data) {
      // update store
      this.$store.dispatch('auth/toggle', data)
      // authenticate axios
      if(data.token) {
        axios.defaults.headers.common['Authorization'] = data.token
      }
      // update localStorage
      if(this.isLocal()) {
        localStorage.setItem(ls.TOKEN, data.token)
        localStorage.setItem(ls.CITIZEN_ID, data.citizen_id)
        localStorage.setItem(ls.HANDLE, data.handle)
        localStorage.setItem(ls.ALBUM_ID, data.album_id)
        localStorage.setItem(ls.PERSONA_ID, data.persona_id)
        localStorage.setItem(ls.PERSONAS, encodePersonas(data.personas))
        localStorage.setItem(ls.ROLES, encodeRoles(data.roles))
      }
    },
    logout() {
      // update store
      this.$store.dispatch('auth/toggle', false)
      // update localStorage
      if(this.isLocal()) {
        localStorage.removeItem(ls.TOKEN)
        localStorage.removeItem(ls.CITIZEN_ID)
        localStorage.removeItem(ls.HANDLE)
        localStorage.removeItem(ls.ALBUM_ID)
        localStorage.removeItem(ls.PERSONA_ID)
        localStorage.removeItem(ls.PERSONAS)
        localStorage.removeItem(ls.ROLES)
      }
    }
  }
}
