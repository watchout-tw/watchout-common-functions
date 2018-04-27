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

function getCookieDomain() {
  let currentURL = window.location.hostname
  return (currentURL.includes('localhost')) ? 'dev.localhost' : 'watchout.tw'
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
    },
    activePersonaIsWithInfo() {
      return this.roles.findIndex(role => role.channel === '*' && role.name === 'with_info') > -1
    }
  },
  methods: {
    isLocal() {
      return process.browser && localStorage
    },
    getTokenCookie() {
      let cookies = Object.assign({}, ...document.cookie.split(';').map(cookie => {
        let [key, value] = cookie.trim().split('=')
        return { [key]: value }
      }))
      return cookies.hasOwnProperty('watchout_token') ? cookies.watchout_token : null
    },
    setTokenCookie(token) {
      let domain = getCookieDomain()
      document.cookie = `watchout_token=${token};Domain=${domain};Path=/`
    },
    clearTokenCookie() {
      let domain = getCookieDomain()
      document.cookie = `watchout_token=;Domain=${domain};Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    },
    checkAuth() {
      if(this.isLocal()) {
        let tokenInLocalStorage = localStorage.getItem(ls.TOKEN)
        let tokenCookie = this.getTokenCookie()

        if(tokenCookie) {
          if(!tokenInLocalStorage) {
            // citizen has logged IN elsewhere
            axios.post('/auth/login', { token: tokenCookie }).then(response => {
              this.setAuth(response.data)
            }).catch(error => {
              console.error(error)
            })
          } else {
            // citizen has logged IN here
            let citizenID = localStorage.getItem(ls.CITIZEN_ID)
            let handle = localStorage.getItem(ls.HANDLE)
            let albumID = localStorage.getItem(ls.ALBUM_ID)
            let personaID = localStorage.getItem(ls.PERSONA_ID)
            let personas = decodePersonas(localStorage.getItem(ls.PERSONAS))
            let roles = decodeRoles(localStorage.getItem(ls.ROLES))
            this.setAuth({
              token: tokenInLocalStorage,
              citizen_id: citizenID,
              handle,
              album_id: albumID,
              persona_id: personaID,
              personas,
              roles
            })
          }
        } else {
          if(tokenInLocalStorage) {
            // citizen has logged OUT elsewhere
            this.logout()
          } else {
            // user is anonymous
          }
        }
      }
    },
    setAuth(data) {
      if(data.token) { // FIXME: need a more rigorous check
        // update store
        this.$store.dispatch('auth/toggle', data)
        // authenticate axios
        axios.defaults.headers.common['Authorization'] = data.token

        if(this.isLocal()) {
          // update localStorage
          localStorage.setItem(ls.TOKEN, data.token)
          localStorage.setItem(ls.CITIZEN_ID, data.citizen_id)
          localStorage.setItem(ls.HANDLE, data.handle)
          localStorage.setItem(ls.ALBUM_ID, data.album_id)
          localStorage.setItem(ls.PERSONA_ID, data.persona_id)
          localStorage.setItem(ls.PERSONAS, encodePersonas(data.personas))
          localStorage.setItem(ls.ROLES, encodeRoles(data.roles))
          // set cookie
          if(!this.getTokenCookie()) {
            this.setTokenCookie(data.token)
          }
        }
      }
    },
    logout() {
      // update store
      this.$store.dispatch('auth/toggle', false)

      if(this.isLocal()) {
        // update localStorage
        localStorage.removeItem(ls.TOKEN)
        localStorage.removeItem(ls.CITIZEN_ID)
        localStorage.removeItem(ls.HANDLE)
        localStorage.removeItem(ls.ALBUM_ID)
        localStorage.removeItem(ls.PERSONA_ID)
        localStorage.removeItem(ls.PERSONAS)
        localStorage.removeItem(ls.ROLES)
        // clear cookie
        this.clearTokenCookie()
      }
      // force redirect to home page
      this.$router.push('/')
    }
  }
}
