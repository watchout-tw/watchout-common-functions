const emailRegEx = /^.+@.+$/
const isoTSRegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/ // ISO 8601 2019-02-01T08:41:59Z
const mysqlTSRegEx = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{6}$/ // FIXME: confirm this

export function isEmail(string) {
  return emailRegEx.test(string)
}

export function isIsoTS(value) {
  return typeof value === 'string' && isoTSRegEx.test(value)
}

export function isMysqlTS(value) {
  return typeof value === 'string' && mysqlTSRegEx.test(value)
}

export function isFsTS(value) {
  return value !== null && typeof value === 'object' && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')
}

export function isoTSToDateObj(isoTS) {
  return new Date(isoTS)
}

export function mysqlTSToDateObj(mysqlTS) {
  let t = mysqlTS.split(/[- :T.Z]/) // FIXME: inconsistent with mysqlTSRegEx
  return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
}

export function fsTSToDateObj(fsTS) {
  return new Date(fsTS.seconds * 1000 + fsTS.nanoseconds / 1000000)
}

export function dateObjToIsoTS(dateObj) {
  return dateObj.toISOString()
}

export function dateObjToMysqlTS(dateObj) {
  return dateObj.toISOString() // FIXME: placeholder for now
}

export function dateObjToFsTS(dateObj) {
  return {
    seconds: Math.floor(dateObj.getTime() / 1000),
    nanoseconds: (dateObj.getTime() % 1000) * 1000
  }
}

export function fsTSCompare(fsTS1, fsTS2) {
  return (fsTS1.seconds * 1000 + fsTS1.nanoseconds / 1000000) - (fsTS2.seconds * 1000 + fsTS2.nanoseconds / 1000000)
}

export const formatter = {
  date(d) {
    let dateObj = null
    if(isMysqlTS(d)) {
      dateObj = mysqlTSToDateObj(d)
    } else if(isFsTS(d)) {
      dateObj = fsTSToDateObj(d)
    } else if(d !== null) {
      dateObj = new Date(d)
    }
    return dateObj ? dateObj.toLocaleDateString('zh-Hans-TW') : 'NaD'
  },
  datetime(d) {
    // new Date() 在 SSR 跟 client 的行為不一致
    // 一個用 Node.js（顯示 Universal）、一個用 Javascript（會調到 GMT+8）
    // 所以會有用 AsyncData parse 過一次，client mode 再 parse 一次時，時間格式不一樣的問題
    let dateObj = null
    if(isMysqlTS(d)) {
      dateObj = mysqlTSToDateObj(d)
    } else if(isFsTS(d)) {
      dateObj = fsTSToDateObj(d)
    } else if(d !== null) {
      dateObj = new Date(d)
    }
    return dateObj ? dateObj.toLocaleString('zh-Hans-TW') : 'NaDT'
  },
  datetimeForFile(d) {
    let dateObj = null
    if(isMysqlTS(d)) {
      dateObj = mysqlTSToDateObj(d)
    } else if(isFsTS(d)) {
      dateObj = fsTSToDateObj(d)
    } else if(d !== null) {
      dateObj = new Date(d)
    }
    return dateObj ? dateObj.toLocaleString('zh-Hans-TW') : 'NaDT'
  },
  dateObj(d) {
    let dateObj = null
    if(isMysqlTS(d)) {
      dateObj = mysqlTSToDateObj(d)
    } else if(isFsTS(d)) {
      dateObj = fsTSToDateObj(d)
    } else if(d !== null) {
      dateObj = new Date(d)
    }
    if(!dateObj) {
      return 'NaD'
    } else {
      return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate(),
        hour: dateObj.getHours(),
        minute: dateObj.getMinutes(),
        second: dateObj.getSeconds()
      }
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
      obj.isActiveClone = null
      temp[key] = deepClone(obj[key])
      delete obj.isActiveClone
    }
  }
  return temp
}

const pushButtonText = {
  pushed: '我已連署',
  pushable: '我要連署',
  finished: '連署結束',
  failed: '連署失敗'
}

export function getQuestionEndDate(question) {
  return new Date(mysqlTSToDateObj(question.push.endDate))
}

export function questionIsOverdue(question) {
  let endDate = getQuestionEndDate(question)
  let now = new Date()
  return now >= endDate
}

export function questionHasReachedThreshold(question) {
  return question.push.count >= question.data.threshold
}

export function questionIsPushedByMe(question) {
  return question.persona_speeches && question.persona_speeches.length > 0 && question.persona_speeches.filter(speech => speech.type === 'ask_question_push').length > 0
}

export function getPushButtonText(question) {
  let text
  if(questionIsOverdue(question)) {
    text = questionHasReachedThreshold(question) ? pushButtonText.finished : pushButtonText.failed
  } else {
    text = questionIsPushedByMe(question) ? pushButtonText.pushed : pushButtonText.pushable
  }
  return text
}

export function getPushButtonClasses(question) {
  let classes
  if(questionIsOverdue(question)) {
    classes = ['disable']
  } else if(questionIsPushedByMe(question)) {
    classes = ['ask-light', 'text-color-inactive-grey', 'immutable']
  } else if(questionHasReachedThreshold(question)) {
    classes = ['ask']
  } else {
    classes = ['musou']
  }
  return classes
}

export function answerIsReviewedByMe(answer) {
  return answer.persona_speeches && answer.persona_speeches.length > 0 && answer.persona_speeches.filter(speech => speech.type === 'ask_answer_review').length > 0
}

export function getMyAnswerReviewScore(answer) {
  let score = null
  if(answerIsReviewedByMe(answer)) {
    score = parseInt(answer.persona_speeches[0].content)
  }
  return score
}

export function formatContent(val, placeholder = '文字') {
  let content = val
  if(typeof val === 'object' && val !== null) {
    content = val.content
  }
  let isAvailable = val && content !== undefined && content !== null && content !== ''
  let result = {
    text: placeholder,
    classes: ['not-available']
  }
  if(isAvailable) {
    result.text = content
    result.classes = []
  }
  return result
}

// access nested attr in obj
export function resolve(obj, path) {
  path = path.split('.')
  let current = obj
  while(path.length) {
    if(typeof current !== 'object') {
      return undefined
    }
    current = current[path.shift()]
  }
  return current
}

export function getCircledDigit(integer) {
  let digits = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
  return integer > 0 && integer <= 10 ? digits[integer] : digits[0]
}
