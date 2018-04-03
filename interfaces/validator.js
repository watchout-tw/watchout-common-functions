function errorMsg (label) {
  return {
    error: true,
    message: '請填入' + label
  }
}

function successMsg () {
  return {
    success: true,
    message: '驗證成功'
  }
}

export default {
  methods: {
    validate (config, obj) {
      for (var key in config) {
        if (config[key].allowNull) {
          continue
        }
        if (!obj.hasOwnProperty(key)) {
          return errorMsg(config[key].label)
        }
        if (!config[key].allowNull && !obj[key]) {
          return errorMsg(config[key].label)
        }
        if (!config[key].allowNull && config[key].isArray && obj[key].length === 0) {
          return errorMsg(config[key].label)
        }
      }
      return successMsg()
    }
  }
}
