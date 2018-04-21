import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      showSupport: 'windowManagement/showSupport',
      modals: 'windowManagement/modals'
    })
  },
  methods: {
    ...mapActions({
      toggleShowSupport: 'windowManagement/toggleShowSupport',
      addModal: 'windowManagement/addModal',
      updateModal: 'windowManagement/updateModal',
      removeModal: 'windowManagement/removeModal'
    }),
    removeModalAfter(id, time) {
      setTimeout(() => {
        this.removeModal(id)
      }, time)
    }
  }
}
