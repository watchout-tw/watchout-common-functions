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
