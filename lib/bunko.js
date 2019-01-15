import * as firestore from 'watchout-common-functions/lib/firestore'
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
export const defaultPubDest = publishDestinations[0]
export function getPubDest(value) {
  let result = Object.assign({}, defaultPubDest)
  let dest = publishDestinations.find(dest => dest.value === value)
  if(dest) {
    result = dest
  }
  return result
}
const SEPARATOR = '://'
export function parseReference(content) {
  let result = false
  if(content !== null && content !== undefined) {
    content = content.trim()
  }
  if(content && content.indexOf('\n') < 0 && content.indexOf(SEPARATOR) > -1) {
    let params = null
    if(content.indexOf('?') > -1) {
      [content, params] = content.split('?', 2)
      params = Object.assign({}, ...params.split('&').map(pair => ({ [pair.split('=', 2)[0]]: pair.split('=', 2)[1] })))
    }
    let [type, id] = content.split(SEPARATOR)
    result = {
      url: content,
      type: (type.length > 0 ? type : null),
      id: (id.length > 0 ? id : null),
      params
    }
  }
  return result
}
export function makeReference(type, id) {
  return (type !== null && type !== undefined ? type : '') + SEPARATOR + (id !== null && id !== undefined ? (id[0] === '/' ? id.substring(1) : id) : '')
}
export function getContentPermalink(reference) {
  let { type, id } = parseReference(reference)
  let url = null
  if(['http', 'https'].includes(type)) {
    url = reference
  } else if(type === 'youtube') {
    url = 'https://www.youtube.com/watch?v=' + id
  } else if(type === 'ghost-asset') {
    url = 'https://beta.bunko.watchout.tw/' + id
  }
  return url
}
export function parseCard(card) {
  let type = card[0]
  let reference = parseReference(card[1].markdown)
  if(reference !== false) {
    type = 'reference'
  }
  let content = type === 'reference' ? card[1].markdown : card[1]
  return {
    type,
    content
  }
}
export async function getReferenceData(type, rawData) {
  let data = {}
  if(type === 'mobiledoc') {
    // find references and fetch content
    for(let i = 0; i < rawData.cards.length; i++) {
      let card = parseCard(rawData.cards[i])
      if(card.type === 'reference') {
        let cardRef = parseReference(card.content)
        if(cardRef.type === 'collection') {
          let collection = await firestore.bunko.getCollection(cardRef.id)
          data[cardRef.url] = collection

          for(let i = 0; i < collection.items.length; i++) {
            let item = collection.items[i]
            let itemRef = parseReference(item.reference)
            if(itemRef.type === 'doc') {
              let doc = await firestore.bunko.getDoc(itemRef.id)
              data[itemRef.url] = doc
            } else if(itemRef.type === 'video') {
              let video = await firestore.bunko.getVideo(itemRef.id)
              data[itemRef.url] = video
            }
          }
        } else if(cardRef.type === 'doc') {
          let doc = await firestore.bunko.getDoc(cardRef.id, true)
          data[cardRef.url] = doc
        }
      }
    }
  }
  return data
}
