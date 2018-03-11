import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isCitizen: 'auth/isCitizen'
    })
  },
  methods: {
    ...mapActions({
      toggleIsCitizen: 'auth/toggle'
    })
  }
}
