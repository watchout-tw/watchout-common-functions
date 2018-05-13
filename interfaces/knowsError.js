export default {
  methods: {
    handleError(error) {
      let response = error.response
      let status = response && response.hasOwnProperty('status') ? parseInt(response.status) : -1
      let message = response.data.message

      console.error(error)
      console.error('Error handler:', (status > 0 ? status : 'NO_STATUS'), message)

      if(status === 401) {
        this.handleErrorUnauthorized()
      } else if(status === 403) {
        this.handleErrorForbidden()
      }
    },
    handleErrorUnauthorized() { // 401
      this.reloadAuth()
    },
    handleErrorForbidden() { // 403
      this.reloadAuth()
    }
  }
}
