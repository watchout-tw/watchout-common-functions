import { mapGetters } from 'vuex'
import * as ls from '../lib/ls'
import * as core from '../lib/core'
import * as ROLES from '../lib/roles'

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
      return Array.isArray(this.personas) && this.personaID !== null ? this.personas.find(persona => persona.id === this.personaID) : null
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
      document.cookie = `watchout_token=${token}`
      document.cookie = `Domain=${domain}`
      document.cookie = 'Path=/'
    },
    clearTokenCookie() {
      let domain = getCookieDomain()
      document.cookie = 'watchout_token='
      document.cookie = `Domain=${domain}`
      document.cookie = 'Path=/'
      document.cookie = 'Expires=Thu, 01 Jan 1970 00:00:01 GMT'
    },
    reloadAuth() {
      if(this.isLocal()) {
        let token = this.getTokenCookie()
        if(token) {
          core.loginWithToken(token).then(response => {
            this.setAuth(response.data)
          }).catch(this.handleError)
        } else {
          this.logout()
        }
      }
    },
    checkAuth() {
      if(this.isLocal()) {
        let tokenInLocalStorage = localStorage.getItem(ls.TOKEN)
        let token = this.getTokenCookie()

        if(token) {
          if(!tokenInLocalStorage) {
            // citizen has logged IN elsewhere
            core.loginWithToken(token).then(response => {
              this.setAuth(response.data)
            }).catch(this.handleError)
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
        } else if(tokenInLocalStorage) {
          // citizen has logged OUT elsewhere
          this.logout()
        }
        // else user is anonymous
      }
    },
    setAuth(data) {
      if(data.token) { // FIXME: need a more rigorous check
        // update store
        this.$store.dispatch('auth/toggle', data)
        // authenticate coreInstance
        core.setAuthorizationHeader(data.token)

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
    clearAuth() {
      // update store
      this.$store.dispatch('auth/toggle', false)
      // unauthenticate coreInstance
      core.unsetAuthorizationHeader()

      if(this.isLocal()) {
        // update localStorage
        localStorage.removeItem(ls.TOKEN)
        localStorage.removeItem(ls.CITIZEN_ID)
        localStorage.removeItem(ls.HANDLE)
        localStorage.removeItem(ls.ALBUM_ID)
        localStorage.removeItem(ls.PERSONA_ID)
        localStorage.removeItem(ls.PERSONAS)
        localStorage.removeItem(ls.ROLES)
        localStorage.removeItem(ls.HANDLE)
        // clear cookie
        this.clearTokenCookie()
      }
    },
    logout() {
      // clear auth data
      this.clearAuth()
      // transport back to home
      this.$router.push('/')
    },
    feAuthenticate() {
      if(this.isCitizen !== true) {
        this.$router.push('/')
      }
    },
    isAuthor() {
      return this.hasRole(ROLES.AUTHOR)
    },
    isEditor() {
      return this.hasRole(ROLES.EDITOR)
    },
    isGod() {
      return this.hasRole(ROLES.GOD)
    },
    hasRole(role) {
      const GLOBAL = '*'
      const SEPARATOR = '.'

      let hasRole = false
      if(this.isLocal() && Array.isArray(this.roles) && role) {
        if(!role.includes(SEPARATOR)) {
          role = `${GLOBAL}${SEPARATOR}${role}`
        }
        let [channel, name] = role.split(SEPARATOR)
        let filteredRoles = this.roles.filter(role => role.channel === channel && role.name === name)
        hasRole = filteredRoles.length > 0
      }
      return hasRole
    },
    matchRoles(...roles) {
      let counter = 0
      roles.forEach(role => {
        counter += this.hasRole(role) ? 1 : 0
      })
      return counter
    },
    hasAllRoles(...roles) {
      return roles.length === this.matchRoles(...roles)
    },
    hasAnyRole(...roles) {
      return this.matchRoles(...roles) > 0
    }
  }
}
