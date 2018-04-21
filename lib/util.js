export function isEmail(string) {
  return /^.+@.+$/.test(string)
}

const mysqlTimestampRex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{6}$/

function mysqlTimestamp2DateObj (mysqlTS) {
  var t = mysqlTS.split(/[- :]/)
  return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
}

export const formatter = {
  date (d) {
    if (typeof d === 'string' && d.match(mysqlTimestampRex)) {
      return mysqlTimestamp2DateObj(d).toLocaleDateString('zh-Hans-TW')
    } else {
      return new Date(d).toLocaleDateString('zh-Hans-TW')
    }
  }
}

export function deepClone(obj) {
  if(obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj) {
    return obj
  }
  let temp
  if(obj instanceof Date) {
    temp = new Date(obj)
  } else {
    temp = obj.constructor()
  }
  for(let key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null
      temp[key] = deepClone(obj[key])
      delete obj['isActiveClone']
    }
  }
  return temp
}

const pushButtonText = {
  failed: '連署失敗',
  finish: '連署結束',
  pushed: '我已連署',
  canPush: '我要連署'
}

export function getPushButtonText (question) {
  var endDate = new Date(mysqlTimestamp2DateObj(question.push.endDate))
  var now = new Date()
  if (now >= endDate) {
    if (question.push.count < question.data.threshold) {
      return pushButtonText.failed
    } else {
      return pushButtonText.finish
    }
  } else {
    if (question.persona_speeches && question.persona_speeches.length > 0) {
      return pushButtonText.pushed
    }
    return pushButtonText.canPush
  }
}

const pushButtonClasses = ['input', 'button']

export function getPushButtonClasses (question) {
  var endDate = new Date(mysqlTimestamp2DateObj(question.push.endDate))
  var now = new Date()
  if (now >= endDate) {
    return pushButtonClasses.concat(['disable'])
  } else {
    if (question.persona_speeches && question.persona_speeches.length > 0) {
      return pushButtonClasses.concat(['ask-light', 'text-color-inactive-grey'])
    }
    if (question.push.count < question.data.threshold) {
      return pushButtonClasses.concat(['musou', 'text-color-white'])
    } else {
      return pushButtonClasses.concat(['ask'])
    }
  }
}
