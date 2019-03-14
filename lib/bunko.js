import * as firestore from '../lib/firestore'
import { parseReference, makeReference } from '../lib/watchout'
export const statuses = [
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
export const publishDestinations = [
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
export const authorTypes = [
  {
    value: 'author',
    valuePlural: 'authors',
    label: '作者'
  },
  {
    value: 'editor',
    valuePlural: 'editors',
    label: '編輯'
  },
  {
    value: 'designer',
    valuePlural: 'designers',
    label: '設計'
  },
  {
    value: 'developer',
    valuePlural: 'developers',
    label: '開發'
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

function contentIsType(keyword, content) {
  let regExp = getMagicRegExp(keyword)
  return regExp.test(content)
}

function parseContentToList(keyword, content) {
  let regExp = getMagicRegExp(keyword)
  return content.replace(regExp, '').split('\n').map(markdown => {
    let markdownLinks = markdown.match(/\[([^\]]+)\]\(([^)]+)\)/g)
    markdownLinks = markdownLinks ? markdownLinks.map(markdownLink => {
      let [, title, reference] = markdownLink.match(/\[([^\]]+)\]\(([^)]+)\)/)
      return {
        title,
        reference,
        referenceObj: parseReference(reference)
      }
    }) : []
    let firstMarkdownLink = markdownLinks.length > 0 ? markdownLinks[0] : null
    return {
      markdown,
      links: markdownLinks,
      title: firstMarkdownLink ? firstMarkdownLink.title : null,
      reference: firstMarkdownLink ? firstMarkdownLink.reference : null,
      referenceObj: firstMarkdownLink ? firstMarkdownLink.referenceObj : null
    }
  })
}

export function parseCard(card) {
  let type = card[0]
  let content = card[1]
  let markdown = null
  let simpleMarkdown = null
  if(type === 'markdown') {
    content = card[1].markdown.trim()

    let reference = parseReference(content)
    if(reference !== false) { // content is reference
      type = 'reference'
      content = reference
    } else if(contentIsType('footnotes', content)) { // content is list of footnotes
      type = 'footnotes'
      content = parseContentToList('footnotes', content)
    } else if(contentIsType('sources', content)) { // content is list of sources
      type = 'sources'
      content = parseContentToList('sources', content)
    } else if(contentIsType('links', content)) { // content is list of links
      type = 'links'
      content = parseContentToList('links', content)
    } else if(contentIsType('note', content)) {
      type = 'note'
      content = content.replace(getMagicRegExp('note'), '')
      markdown = markdownPreprocessor(content)
      simpleMarkdown = markdownPreprocessor(content, false)
    } else if(contentIsType('excerpt', content)) {
      type = 'excerpt'
      content = content.replace(getMagicRegExp('excerpt'), '')
      markdown = markdownPreprocessor(content)
      simpleMarkdown = markdownPreprocessor(content, false)
    } else { // just markdown
      markdown = markdownPreprocessor(content)
      simpleMarkdown = markdownPreprocessor(content, false)
    }
  } else if(type === 'image') {
    content.reference = makeReference('ghost-asset', content.src)
    simpleMarkdown = markdown = `![${content.caption ? content.caption : ''}](${content.reference.permalink})`
  }
  let result = {
    type,
    content,
    ...markdown && { markdown },
    ...simpleMarkdown && { simpleMarkdown }
  }
  return result
}

export async function getDataOnReferences(references) {
  let result = {}

  // flatten collections
  let collections = await Promise.all(references.filter(ref => ref.type === 'collection').map(ref => firestore.bunko.getCollection(ref.id, true)))
  collections.forEach(collection => {
    references.push(...collection.items.map(item => item.referenceObj))
  })

  // fetch data on all references
  let fetchedData = await Promise.all(references.map(ref => {
    let promise = null
    if(ref.type === 'doc') {
      promise = firestore.bunko.getDoc(ref.id, true)
    } else if(ref.type === 'video') {
      promise = firestore.bunko.getVideo(ref.id)
    } else if(ref.type === 'event') {
      promise = firestore.bunko.getEvent(ref.id)
    } else if(ref.type === 'collection') {
      promise = firestore.bunko.getCollection(ref.id, true)
    } else if(['http', 'https'].includes(ref.type)) {
      promise = firestore.watchout.scrapeMetadata(ref.permalink)
    }
    return promise
  }))

  // map references to data
  for(let i = 0; i < fetchedData.length; i++) {
    result[references[i].url] = fetchedData[i]
  }
  return result
}

export async function mobiledocProcessor(mobiledoc) {
  let references = []
  let footnotes = []
  let sources = []
  let links = []

  // parse cards & find references
  let cards = mobiledoc.cards.map(card => parseCard(card))
  for(let card of cards) {
    let { type, content } = card
    if(type === 'reference') {
      references.push(content)
    } else if(['footnotes', 'sources', 'links'].includes(type)) {
      content.forEach(item => {
        if(item.hasOwnProperty('links')) {
          references.push(...item.links.map(link => link.referenceObj))
        } else {
          references.push(item.referenceObj)
        }
      })
      if(type === 'footnotes') {
        footnotes = content
      } else if(type === 'sources') {
        sources = content
      } else if(type === 'links') {
        links = content
      }
    }
  }

  // get data on references (also finding more references)
  let dataOnReferences = await getDataOnReferences(references)

  // make markdown
  let sections = mobiledoc.sections
  let markdown = []
  let simpleMarkdown = []
  sections.forEach(section => {
    let isCard = section[0] === 10
    if(isCard) {
      let card = cards[section[1]]
      if(card.markdown) {
        markdown.push(card.markdown)
      }
      if(card.simpleMarkdown) {
        simpleMarkdown.push(card.simpleMarkdown)
      }
    }
  })
  const NP = '\n\n'
  markdown = markdown.join(NP)
  simpleMarkdown = simpleMarkdown.join(NP)

  return {
    sections,
    cards,
    markdown,
    simpleMarkdown,
    footnotes,
    sources,
    links,
    references,
    dataOnReferences
  }
}

export function markdownPreprocessor(markdown, showCodeObject = true) {
  let regExp = /[ ]*{{(.+?)}}[ ]*/g
  let codeObjects = []
  let match = regExp.exec(markdown)
  while(match) {
    codeObjects.push({
      code: match[1].trim(),
      matchLength: match[0].length,
      matchAt: match.index
    })
    match = regExp.exec(markdown)
  }
  codeObjects.sort((a, b) => b.matchAt - a.matchAt)
  codeObjects.forEach(({ code, matchLength, matchAt }) => {
    let html = ''
    let ref = parseReference(code)
    if(showCodeObject && ref.type === 'footnote') {
      html = `<label class="footnote-anchor" data-id="${ref.id}">${ref.id}</label>`
    }
    markdown = markdown.substring(0, matchAt) + html + markdown.substring(matchAt + matchLength)
  })
  return markdown
}

export function spacingOptimizer(text) {
  let punctGroups = [
    {
      label: 'thin',
      list: ['，', '。', '、', '：', '；', '！']
    },
    {
      label: 'thick',
      list: ['？']
    },
    {
      label: 'left',
      list: ['（', '《', '〈', '「', '【']
    },
    {
      label: 'right',
      list: ['）', '》', '〉', '」', '】']
    }
  ]
  let html = ''
  // NOTE: slower & better structured HTML
  let allPunct = [].concat(...punctGroups.map(g => g.list))
  let regExpAllPunct = new RegExp(`([${allPunct.join('')}])`, 'g')
  if(text) {
    html = text.split(regExpAllPunct).map(span => {
      let result = `<span>${span}</span>`
      for(let j = 0; j < punctGroups.length; j++) {
        let punctGroup = punctGroups[j]
        let regExp = new RegExp(`([${punctGroup.list.join('')}])`, 'g')
        if(regExp.test(span)) {
          result = `<span class="full-width-punct ${punctGroup.label}-punct">${span}</span>`
          break
        }
      }
      return result
    }).join('')
  }
  /*
  // NOTE: faster & less structured HTML
  if(text) {
    punctGroups.forEach(punctGroup => {
      let regExp = new RegExp(`([${punctGroup.list.join('')}])`, 'g')
      text = text.replace(regExp, `<span class="full-width-punct ${punctGroup.label}-punct">$1</span>`)
    })
  }
  html = text
  */
  return html
}
