import * as firestore from 'watchout-common-functions/lib/firestore'
import { getPageMeta } from 'watchout-common-functions/lib/util'
import { parseReference } from 'watchout-common-functions/lib/watchout'
export let statuses = [
  {
    value: 'active',
    label: '顯示'
  },
  {
    value: 'inactive',
    label: '隱藏'
  },
  {
    value: 'new',
    label: '最新'
  }
]
export let publishDestinations = [
  {
    value: 'watchout',
    label: '沃草'
  },
  {
    value: 'musou',
    label: '國會無雙'
  },
  {
    value: 'uc',
    label: '公民學院'
  },
  {
    value: 'ask',
    label: '給問擂台'
  },
  {
    value: 'lab',
    label: '議題實驗室'
  }
]
export let authorTypes = [
  {
    value: 'author',
    valuePlural: 'authors',
    label: '作者'
  },
  {
    value: 'editor',
    valuePlural: 'editors',
    label: '編輯'
  }
]
export const defaultPubDest = publishDestinations[0]

export function getPubDest(value) {
  let result = Object.assign({}, defaultPubDest)
  let dest = publishDestinations.find(dest => dest.value === value)
  if(dest) {
    result = dest
  }
  return result
}

function getMagicRegExp(keyword) {
  return new RegExp('^{{[\\s]*' + keyword + '[\\s]*}}[\\s]*') // escape \s into \\s
}

function contentIsList(keyword, content) {
  let regExp = getMagicRegExp(keyword)
  return regExp.test(content)
}

function parseContentToList(keyword, content) {
  let regExp = getMagicRegExp(keyword)
  return content.replace(regExp, '').split('\n').map(line => {
    let [, title, reference] = line.match(/\[(.+)\]\((.+)\)/)
    return {
      line,
      title,
      reference,
      referenceObj: parseReference(reference)
    }
  })
}

export function parseCard(card) {
  let type = card[0]
  let content = card[1]
  if(type === 'markdown') {
    content = card[1].markdown.trim()

    let reference = parseReference(content)
    if(reference !== false) { // content is reference
      type = 'reference'
      content = reference
    } else if(contentIsList('footnotes', content)) { // content is list of footnotes
      type = 'footnotes'
      content = parseContentToList('footnotes', content)
    } else if(contentIsList('links', content)) { // content is list of links
      type = 'links'
      content = parseContentToList('links', content)
    }
  }
  return {
    type,
    content
  }
}

export async function getDataOnReferences(references) {
  let data = {}

  // FIXME: this is way too slow
  for(let ref of references) {
    let newData = null
    let moreReferences = false
    if(ref.type === 'collection') {
      newData = await firestore.bunko.getCollection(ref.id)
      moreReferences = true
    } else if(ref.type === 'doc') {
      newData = await firestore.bunko.getDoc(ref.id, true)
    } else if(ref.type === 'video') {
      newData = await firestore.bunko.getVideo(ref.id)
    } else if(['http', 'https'].includes(ref.type)) {
      newData = await getPageMeta(ref.url)
    }
    data[ref.url] = newData
    if(moreReferences) {
      if(ref.type === 'collection') {
        for(let item of newData.items) {
          references.push(item.referenceObj)
        }
      }
    }
    moreReferences = false
  }
  return data
}

export async function mobiledocProcessor(mobiledoc) {
  let references = []
  let footnotes = []
  let links = []

  // parse cards & find references
  for(let card of mobiledoc.cards) {
    let { type, content } = parseCard(card)
    if(type === 'reference') {
      references.push(content)
    } else if(['footnotes', 'links'].includes(type)) {
      references.push(...content.map(item => item.referenceObj))
      if(type === 'footnotes') {
        footnotes = content
      } else if(type === 'links') {
        links = content
      }
    }
  }

  // get data on references (also finding more references)
  let dataOnReferences = await getDataOnReferences(references)

  return {
    footnotes,
    links,
    references,
    dataOnReferences
  }
}

export function spacingOptimizer(text) {
  let punctuations = ['，', '。', '、', '：', '；', '！']
  let regExp = new RegExp(`([${punctuations.join('')}]+)`, 'g')
  let html = ''
  if(text) {
    html = text.split(regExp).map(span => regExp.test(span) ? `<span class="full-width-punctuation">${span}</span>` : `<span>${span}</span>`).join('')
  }
  return html
}
