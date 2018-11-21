import axios from 'axios'

const v = 'v1beta1'
const baseURL = 'https://firestore.googleapis.com/' + v + '/projects/watchout-bunko-dev/databases/(default)/documents'

export const firestoreInstance = axios.create({
  baseURL: baseURL,
  headers: {}
})

function fsValueObjectParser(valueObj) {
  let value = null
  if(typeof valueObj !== 'object') {
    return valueObj
  }
  if(valueObj.hasOwnProperty('stringValue')) {
    value = valueObj.stringValue
  } else if(valueObj.hasOwnProperty('arrayValue')) {
    value = valueObj.arrayValue.values.map(arrayItem => fsValueObjectParser(arrayItem))
  }
  return value
}

export async function getDocs() {
  let docs = await firestoreInstance.get('/docs')
  docs = docs.data.documents.map(doc => {
    let docObj = {
      id: doc.name.split('/').pop()
    }
    docObj = Object.assign(docObj, ...Object.keys(doc.fields).map(key => {
      let valueObj = doc.fields[key]
      let value = fsValueObjectParser(valueObj)
      return {
        [key]: value
      }
    }))
    return docObj
  })
  return docs
}
