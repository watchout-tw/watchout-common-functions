import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      showSupport: 'windowManagement/showSupport',
      modals: 'windowManagement/modals',
      joinOrLogin: 'windowManagement/joinOrLogin'
    })
  },
  methods: {
    ...mapActions({
      toggleShowSupport: 'windowManagement/toggleShowSupport',
      addModal: 'windowManagement/addModal',
      removeModal: 'windowManagement/removeModal',
      showJoin: 'windowManagement/showJoin',
      showLogin: 'windowManagement/showLogin'
    }),
    removeModalAfter(id, time) {
      setTimeout(() => {
        this.removeModal(id)
      }, time)
    }
  }
}
