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
export function parseCard(card) {
  let type = card[0]
  let content = card[1]
  if(type === 'markdown') {
    content = card[1].markdown.trim()
    // try to parse content as reference
    let reference = parseReference(content)
    if(reference !== false) {
      type = 'reference'
      content = reference
    }
  }
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
        let cardRef = card.content
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
            } else if(['http', 'https'].includes(itemRef.type)) {
              let meta = await getPageMeta(itemRef.url)
              data[itemRef.url] = meta
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
