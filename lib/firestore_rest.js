const axios = require('axios')
const feedConfig = require('../config/feed.config')

const v = 'v1'
const projectID = feedConfig.projectID
const baseURL = `https://firestore.googleapis.com/${v}/projects/${projectID}/databases/(default)/documents`
const firestoreInstance = axios.create({
  baseURL: baseURL,
  headers: {}
})

function fsValueObjectParser(valueObj) {
  let value = null
  if(typeof valueObj !== 'object') {
    return valueObj
  }
  if(valueObj.hasOwnProperty('timestampValue')) {
    value = valueObj.timestampValue
  } else if(valueObj.hasOwnProperty('stringValue')) {
    value = valueObj.stringValue
  } else if(valueObj.hasOwnProperty('arrayValue')) {
    value = valueObj.arrayValue.values ? valueObj.arrayValue.values.map(arrayItem => fsValueObjectParser(arrayItem)) : []
  }
  return value
}

function fsDocumentListParser(list) {
  return list.documents.map(doc => {
    let docObj = {
      id: doc.name.split('/').pop()
    }
    let keys = Object.keys(doc.fields)
    keys.sort()
    keys.forEach(key => {
      let valueObj = doc.fields[key]
      let value = fsValueObjectParser(valueObj)
      docObj[key] = value
    })
    return docObj
  })
}

async function getDocs() {
  let params = {
    pageSize: 10,
    orderBy: 'publishedAt desc'
  }
  let docs = await firestoreInstance.get('/docs', { params })
  docs = fsDocumentListParser(docs.data)
  return docs
}

async function getProjects() {
  let params = {
    pageSize: 10,
    orderBy: 'publishedAt desc'
  }
  let projects = await firestoreInstance.get('/projects', { params })
  projects = fsDocumentListParser(projects.data)
  return projects
}

module.exports = {
  getDocs,
  getProjects
}
