function error(message) {
  return {
    error: true,
    message
  }
}

function success() {
  return {
    success: true,
    message: '通過驗證'
  }
}

export default {
  methods: {
    validate(config, obj) {
      for(var key in config) {
        if(config[key].allowNull) {
          continue
        }
        if(!obj.hasOwnProperty(key)) {
          return error(config[key].messages.missing)
        }
        if(!config[key].allowNull && !obj[key]) {
          return error(config[key].messages.missing)
        }
        if(!config[key].allowNull && config[key].isArray && obj[key].length === 0) {
          return error(config[key].messages.missing)
        }
      }
      return success()
    }
  }
}
