import firebaseConfig from 'watchout-common-functions/config/firebase.config'
import * as firestore from 'watchout-common-functions/lib/firestore'
import * as util from 'watchout-common-functions/lib/util'

export default {
  computed: {
    fsCurrentUser() {
      return this.$store.state.fsAuth.currentUser
    },
    fsCurrentUserEmail() {
      return this.fsCurrentUser.email
    },
    fsIsAuthenticated() {
      return this.currentUserEmail !== null
    },
    isCitizen() {
      return this.fsCurrentUserEmail !== null && this.fsCurrentUserEmail !== firebaseConfig.sysUsers.anyone.email
    },
    activePersonaID() {
      return this.$store.state.fsAuth.activePersona.id
    },
    activePersona() {
      return this.$store.state.fsAuth.activePersona
    }
  },
  methods: {
    async login(account, password) {
      let data = { password }
      if(util.isEmail(this.account)) {
        data.email = account
      } else {
        data.handle = account
      }
      await firestore.park.login(data)
    },
    async logout() {
      await firestore.park.logout()
    }
  }
}
