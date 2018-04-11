import { mapGetters, mapActions } from 'vuex'
import * as localStorage from '../lib/localStorage'

export default {
  computed: {
    ...mapGetters({
      isCitizen: 'auth/isCitizen'
    }),
    citizenID() {
    }
  },
  methods: {
    ...mapActions({
      toggleIsCitizen: 'auth/toggle'
    }),
    logout() {
      this.$store.dispatch('auth/toggle', false)
      localStorage.cleanSlate()
    }
  }
}
