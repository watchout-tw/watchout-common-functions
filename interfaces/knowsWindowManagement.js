import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      showSupport: 'windowManagement/showSupport',
      modals: 'windowManagement/modals'
    })
  },
  methods: {
    toggleShowSupport(value) {
      this.$store.dispatch('windowManagement/toggleShowSupport', value)
    },
    addModal(id) {
      this.$store.dispatch('windowManagement/addModal', id)
    }
  }
}
