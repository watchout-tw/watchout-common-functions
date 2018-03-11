import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      showSupport: 'windowManagement/showSupport'
    })
  },
  methods: {
    toggleShowSupport(value) {
      this.$store.dispatch('windowManagement/toggleShowSupport', value)
    }
  }
}
