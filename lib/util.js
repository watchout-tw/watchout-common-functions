import * as springboard from 'watchout-common-functions/lib/springboard'
const emailRegEx = /^.+@.+$/
const isoTSRegEx = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/ // ISO 8601 2019-02-01T08:41:59Z
const mysqlTSRegEx = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{6}$/ // FIXME: confirm this

function zeroPadding(number, digits = 2) {
  return number >= Math.pow(10, digits) ? '' + number : ('0'.repeat(digits) + number).slice(-1 * digits)
}

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
  return typeof value === 'object' && value.hasOwnProperty('seconds') && value.hasOwnProperty('nanoseconds')
}

export function isoTSToDateObj(isoTS) {
  return new Date(isoTS)
}

export function mysqlTSToDateObj(mysqlTS) {
  var t = mysqlTS.split(/[- :T.Z]/) // FIXME: inconsistent with mysqlTSRegEx
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

export const formatter = {
  date(d) {
    let dateObj = null
    if(isMysqlTS(d)) {
      dateObj = mysqlTSToDateObj(d)
    } else if(isFsTS(d)) {
      dateObj = fsTSToDateObj(d)
    } else {
      dateObj = new Date(d)
    }
    return dateObj.toLocaleDateString('zh-Hans-TW')
  },
  datetime(d) {
    let dateObj = null
    if(isMysqlTS(d)) {
      dateObj = mysqlTSToDateObj(d)
    } else if(isFsTS(d)) {
      dateObj = fsTSToDateObj(d)
    } else {
      dateObj = new Date(d)
    }
    return dateObj.toLocaleDateString('zh-Hans-TW') + ' ' + [zeroPadding(dateObj.getHours()), zeroPadding(dateObj.getMinutes()), zeroPadding(dateObj.getSeconds())].join(':')
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

export async function getPageMeta(url) {
  let result = null
  try {
    result = await springboard.getMeta(url)
    let images = result.meta.filter(meta => {
      let name = meta.name ? meta.name : (meta.property ? meta.property : null)
      return name && ['image', 'og:image', 'twitter:image'].includes(name)
    }).map(meta => meta.content)
    result.images = [...new Set(images)]
  } catch(error) {
    console.error('getPageMeta Error: ' + error.message)
    if(error.response) {
      console.error('Response was:')
      console.error(error.response.data)
      console.error(error.response.status)
      console.error(error.response.headers)
    } else if(error.request) {
      console.error('Request was:')
      console.error(error.request)
    }
  }
  return result
}
