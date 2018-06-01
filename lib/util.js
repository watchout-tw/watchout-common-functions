const emailRegEx = /^.+@.+$/
const mysqlTSRegEx = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{6}$/

export function isEmail(string) {
  return emailRegEx.test(string)
}

export function isMysqlTS(string) {
  return mysqlTSRegEx.test(string)
}

export function mysqlTSToDateObj(mysqlTS) {
  var t = mysqlTS.split(/[- :]/)
  return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
}

export const formatter = {
  date(d) {
    if(typeof d === 'string' && mysqlTSRegEx.test(d)) {
      return mysqlTSToDateObj(d).toLocaleDateString('zh-Hans-TW')
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
  } else {
    if(questionIsPushedByMe(question)) {
      classes = ['ask-light', 'text-color-inactive-grey', 'immutable']
    } else if(questionHasReachedThreshold(question)) {
      classes = ['ask']
    } else {
      classes = ['musou']
    }
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
  if(typeof val === 'object') {
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
