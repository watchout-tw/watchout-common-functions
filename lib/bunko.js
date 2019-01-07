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
export function getPubDest(value) {
  let result = Object.assign({}, publishDestinations[0])
  let dest = publishDestinations.find(dest => dest.value === value)
  if(dest) {
    result = dest
  }
  return result
}
export function getPubDestFromContent(type, rawDoc) {
  let value = publishDestinations[0].value
  let tag = null
  if(type === 'ghost') {
    tag = rawDoc.tags && rawDoc.tags.length > 0 ? rawDoc.tags[0] : null
    tag = tag && publishDestinations.map(dest => dest.value).includes(tag.slug) ? tag : null
  }
  if(tag) {
    value = tag.slug
  }
  return getPubDest(value)
}
const SEPARATOR = '://'
export function parseReference(content) {
  let result = false
  if(content !== null && content !== undefined) {
    content = content.trim()
  }
  if(content && content.indexOf('\n') < 0 && content.indexOf(SEPARATOR) > -1) {
    let [type, id] = content.split(SEPARATOR)
    result = {
      type: (type.length > 0 ? type : null),
      id: (id.length > 0 ? id : null)
    }
  }
  return result
}
export function makeReference(type, id) {
  return (type !== null && id !== undefined ? type : '') + SEPARATOR + (id !== null && id !== undefined ? id : '')
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
        let cardRefStr = card.content
        let cardRef = parseReference(cardRefStr)
        if(cardRef.type === 'collection') {
          let collection = await firestore.bunko.getCollection(cardRef.id)
          data[cardRefStr] = collection

          for(let i = 0; i < collection.items.length; i++) {
            let item = collection.items[i]
            let itemRefStr = item.reference
            let itemRef = parseReference(itemRefStr)
            if(itemRef.type === 'doc') {
              let doc = await firestore.bunko.getDoc(itemRef.id)
              data[itemRefStr] = doc
            } else if(itemRef.type === 'video') {
              let video = await firestore.bunko.getVideo(itemRef.id)
              data[itemRefStr] = video
            }
          }
        } else if(cardRef.type === 'doc') {
          let doc = await firestore.bunko.getDoc(cardRef.id, true)
          data[cardRefStr] = doc
        }
      }
    }
  }
  return data
}
