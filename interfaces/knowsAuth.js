import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isCitizen: 'auth/isCitizen'
    })
  },
  methods: {
    toggleIsCitizen(value) {
      this.$store.dispatch('auth/toggle', value)
    }
  }
}
