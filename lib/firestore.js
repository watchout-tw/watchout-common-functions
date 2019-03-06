import firebaseConfig from '../config/firebase.config'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { parseReference, makeReference } from '../lib/watchout'
import { defaultPubDest, authorTypes } from '../lib/bunko'
import { fsTSToDateObj } from '../lib/util'
import * as core from '../lib/core'
import axios from 'axios'
// const cheerio = require('cheerio')

if(firebase.apps.length < 1) {
  firebase.initializeApp(firebaseConfig.projects.bunko)
}

let firestore = firebase.firestore()
// firestore.settings(firebaseConfig.db) // no db settings required

// bunko functions

function getPublishInfo(date = new Date()) {
  return {
    publishedFrom: 'firestore',
    publishedAt: date
  }
}

function getUpdateInfo(date = new Date()) {
  return {
    updatedAt: date
  }
}

function handleFsError(error) {
  console.error(error.toString()) // FIXME: better error handling?
}

async function getDocs({ pubDest = '*', activeOnly = true, desc = true, tagID = null, limit = -1 } = {}) {
  let fsRef = firestore.collection('docs')
  if(pubDest !== '*') {
    fsRef = fsRef.where('publishedTo', '==', pubDest)
  }
  if(tagID) {
    fsRef = fsRef.where('tags', 'array-contains', tagID)
  }
  if(activeOnly) {
    fsRef = fsRef.where('status', '==', 'active')
  }

  fsRef = fsRef.orderBy('publishedAt', desc ? 'desc' : 'asc')
  if(limit > 0) {
    fsRef = fsRef.limit(limit)
  }

  let snapshot = null
  let docs = []
  try {
    snapshot = await fsRef.get()
  } catch(error) {
    handleFsError(error)
  }
  if(snapshot) {
    snapshot.forEach(doc => {
      docs.push(Object.assign(doc.data(), { id: doc.id }))
    })
  }
  docs = docs.map(doc => Object.assign(doc, {
    imageObj: parseReference(doc.image),
    referenceObj: parseReference(doc.reference)
  }))
  return docs
}

async function getDoc(id, withContent = false) {
  let doc = null
  let snapshot = await firestore.collection('docs').doc(id).get()
  if(snapshot && snapshot.id && snapshot.data()) {
    doc = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get doc', id)
  }
  if(doc && withContent) {
    let contentSnapshot = await firestore.collection('docs').doc(id).collection('versions').orderBy('date', 'desc').limit(1).get()
    if(contentSnapshot) {
      contentSnapshot.forEach(docInSnapshot => {
        doc.content = docInSnapshot.data().content
      })
    }
  }
  if(doc) {
    doc.imageObj = parseReference(doc.image)
    doc.referenceObj = parseReference(doc.reference)
  }
  return doc
}

async function getDocByContent(type, id) {
  let docs = []
  let snapshot
  if(type === 'firestore') {
    snapshot = await firestore.collection('docs').doc(id).get()
    if(snapshot && snapshot.id && snapshot.data()) {
      docs.push(Object.assign(snapshot.data(), { id: snapshot.id }))
    } else {
      console.error('Cannot get doc', id)
    }
  } else if(type === 'ghost') {
    snapshot = await firestore.collection('docs').where('reference', '==', makeReference(type, id).url).get()
    if(snapshot) {
      snapshot.forEach(doc => {
        docs.push(Object.assign(doc.data(), { id: doc.id }))
      })
    }
  }
  let doc = docs.length > 0 ? docs[0] : null
  if(doc) {
    doc.imageObj = parseReference(doc.image)
    doc.referenceObj = parseReference(doc.reference)
  }
  return docs
}

function makeDoc(type, rawDoc, cachedAuthors, status = 'active') {
  let doc = {
    status,
    reference: null,
    content: null,
    title: null,
    image: null,
    imageLicense: null,
    description: null,
    tags: [],
    publishedTo: defaultPubDest.value
  }
  doc = Object.assign(doc, ...authorTypes.map(type => ({ [type.valuePlural]: [] })))

  if(rawDoc) {
    doc.authors = rawDoc.authors.map(rawAuthor => {
      let personaID = null
      let rawID = rawAuthor.id
      let author = cachedAuthors.find(author => {
        let ref = parseReference(author.reference)
        return ref.type === type && ref.id === rawID
      })
      if(author) {
        personaID = author.persona
      }
      return personaID
    }).filter(authorID => authorID !== null)

    if(type === 'ghost') {
      let ref = makeReference(type, rawDoc.id)
      doc.reference = ref.url
      doc.referenceObj = ref
      doc.content = rawDoc
      doc.title = rawDoc.title
    }
  }
  return doc
}

async function addDoc(doc) {
  let content = doc.content

  delete doc.id
  delete doc.publishedFrom
  delete doc.publishedAt
  delete doc.updatedAt
  delete doc.content
  delete doc.imageObj
  delete doc.referenceObj

  doc = Object.assign(doc, getPublishInfo())

  let ref = firestore.collection('docs').doc()
  await ref.set(doc)
  if(content) {
    await addDocContentVersion(ref, content)
  }
  return getDoc(ref.id, true)
}

async function updateDoc(docID, doc) {
  let content = doc.content

  delete doc.id
  delete doc.publishedFrom
  delete doc.publishedAt
  delete doc.updatedAt
  delete doc.content
  delete doc.imageObj
  delete doc.referenceObj

  doc = Object.assign(doc, getUpdateInfo())

  let ref = firestore.collection('docs').doc(docID)
  await ref.update(doc)
  if(content) {
    await addDocContentVersion(ref, content)
  }
  return getDoc(docID, true)
}

async function addDocContentVersion(docRef, content) {
  let date = new Date()
  await docRef.collection('versions').add({
    date,
    content
  })
}

async function getAuthors() {
  let snapshot = await firestore.collection('authors').get()
  let authors = []
  if(snapshot) {
    snapshot.forEach(author => {
      authors.push(Object.assign(author.data(), { id: author.id }))
    })
  }

  // custom sort
  authors.sort((a, b) => parseInt(a.persona) - parseInt(b.persona))

  // make referenceObj
  authors = authors.map(author => Object.assign(author, {
    referenceObj: parseReference(author.reference)
  }))

  // get personas
  let fetchedPersonas = await Promise.all(authors.map(author => {
    return core.getPersona(author.persona)
  }))
  for(let i = 0; i < authors.length; i++) {
    let personaObj = fetchedPersonas[i].data
    personaObj = Object.keys(personaObj).length > 0 ? personaObj : null // check if personaObj is {}
    authors[i].personaObj = personaObj
  }

  return authors
}

async function getAuthor(id) {
  let snapshot = await firestore.collection('authors').doc(id).get()
  let author = null
  if(snapshot && snapshot.id && snapshot.data()) {
    author = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get author', id)
  }

  // make referenceObj
  author.referenceObj = parseReference(author.reference)

  // get persona
  let persona = await core.getPersona(author.persona)
  persona = persona.data
  author.personaObj = Object.keys(persona).length > 0 ? persona : null

  return author
}

async function addAuthor(author) {
  delete author.id
  delete author.publishedFrom
  delete author.publishedAt
  delete author.updatedAt
  delete author.personaObj
  delete author.referenceObj

  author = Object.assign(author, getPublishInfo())

  let ref = firestore.collection('authors').doc()
  await ref.set(author)
  return getAuthor(ref.id)
}

async function updateAuthor(authorID, author) {
  delete author.id
  delete author.publishedFrom
  delete author.publishedAt
  delete author.updatedAt
  delete author.personaObj
  delete author.referenceObj

  author = Object.assign(author, getUpdateInfo())
  await firestore.collection('authors').doc(authorID).update(author)
  return getAuthor(authorID)
}

function makeAuthor(type, rawAuthor) {
  let author = {
    persona: null,
    reference: null
  }
  if(rawAuthor) {
    let ref = makeReference(type, rawAuthor.id)
    author.reference = ref.url
    author.referenceObj = ref
  }
  return author
}

async function getVideos() {
  let snapshot = await firestore.collection('videos').get()
  let videos = []
  if(snapshot) {
    snapshot.forEach(video => {
      videos.push(Object.assign(video.data(), { id: video.id }))
    })
  }
  videos = videos.map(video => Object.assign(video, { referenceObj: parseReference(video.reference) }))
  return videos
}

async function getVideo(id) {
  let snapshot = await firestore.collection('videos').doc(id).get()
  let video = null
  if(snapshot && snapshot.id && snapshot.data()) {
    video = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get video', id)
  }
  video.referenceObj = parseReference(video.reference)
  return video
}

async function addVideo(video) {
  delete video.id
  delete video.publishedAt
  delete video.publishedFrom
  delete video.updatedAt
  delete video.referenceObj

  video = Object.assign(video, getPublishInfo())

  let ref = firestore.collection('videos').doc()
  await ref.set(video)
  return getVideo(ref.id)
}

async function updateVideo(videoID, video) {
  delete video.id
  delete video.publishedAt
  delete video.publishedFrom
  delete video.updatedAt
  delete video.referenceObj

  video = Object.assign(video, getUpdateInfo())

  await firestore.collection('videos').doc(videoID).update(video)
  return getVideo(videoID)
}

async function getCollections() {
  let snapshot = await firestore.collection('collections').get()
  let collections = []
  if(snapshot) {
    snapshot.forEach(collection => {
      collections.push(Object.assign(collection.data(), { id: collection.id }))
    })
  }
  return collections
}

async function getCollection(id, withItems = true) {
  let snapshot = await firestore.collection('collections').doc(id).get()
  let collection = null
  if(snapshot && snapshot.id && snapshot.data()) {
    collection = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get collection', id)
  }
  if(collection && withItems) {
    let itemsSnapshot = await firestore.collection('collections').doc(id).collection('items').orderBy('index', 'asc').get()
    let items = []
    if(itemsSnapshot) {
      itemsSnapshot.forEach(itemSnapshot => {
        let item = Object.assign(itemSnapshot.data(), { id: itemSnapshot.id })
        item.referenceObj = parseReference(item.reference)
        items.push(item)
      })
    } else {
      console.error('Cannot get items of collection', id)
    }
    collection.items = items
  }
  return collection
}

async function addCollection(collection) {
  delete collection.id
  delete collection.publishedAt
  delete collection.publishedFrom
  delete collection.updatedAt
  delete collection.items

  collection = Object.assign(collection, getPublishInfo())

  let ref = firestore.collection('collections').doc()
  await ref.set(collection)
  return getCollection(ref.id, false)
}

async function updateCollection(collectionID, collection) {
  delete collection.id
  delete collection.publishedAt
  delete collection.publishedFrom
  delete collection.updatedAt
  delete collection.items

  collection = Object.assign(collection, getUpdateInfo())

  await firestore.collection('collections').doc(collectionID).update(collection)
  return getCollection(collectionID, false)
}

async function getCollectionItem(collectionID, itemID) {
  let snapshot = await firestore.collection('collections').doc(collectionID).collection('items').doc(itemID).get()
  let item = null
  if(snapshot && snapshot.id && snapshot.data()) {
    item = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get item', itemID, 'of collection', collectionID)
  }
  return item
}

async function addCollectionItem(collectionID, item) {
  delete item.id
  delete item.publishedFrom
  delete item.publishedAt
  delete item.updatedAt
  delete item.referenceObj

  let index = parseInt(item.index)
  item.index = index ? index : null
  item = Object.assign(item, getPublishInfo())

  let ref = firestore.collection('collections').doc(collectionID).collection('items').doc()
  await ref.set(item)
  return getCollectionItem(collectionID, ref.id)
}

async function updateCollectionItem(collectionID, itemID, item) {
  delete item.id
  delete item.publishedFrom
  delete item.publishedAt
  delete item.updatedAt
  delete item.referenceObj

  let index = parseInt(item.index)
  item.index = index ? index : null
  item = Object.assign(item, getUpdateInfo())

  await firestore.collection('collections').doc(collectionID).collection('items').doc(itemID).update(item)
  return getCollectionItem(collectionID, itemID)
}

async function deleteCollectionItem(collectionID, itemID) {
  await firestore.collection('collections').doc(collectionID).collection('items').doc(itemID).delete()
}

async function getTags() {
  let snapshot = await firestore.collection('tags').orderBy('title', 'asc').get()
  let tags = []
  if(snapshot) {
    snapshot.forEach(tag => {
      tags.push(Object.assign(tag.data(), { id: tag.id }))
    })
  }
  return tags
}

async function getTag(id) {
  let snapshot = await firestore.collection('tags').doc(id).get()
  let tag = null
  if(snapshot && snapshot.id && snapshot.data()) {
    tag = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get tag', id)
  }
  return tag
}

async function getTagBySlug(slug) {
  let snapshot
  let tags = []
  snapshot = await firestore.collection('tags').where('slug', '==', slug).get()
  if(snapshot) {
    snapshot.forEach(tag => {
      tags.push(Object.assign(tag.data(), { id: tag.id }))
    })
  }
  return tags.length > 0 ? tags[0] : null
}

async function addTag(tag) {
  delete tag.id
  delete tag.publishedFrom
  delete tag.publishedAt
  delete tag.updatedAt

  tag = Object.assign(tag, getPublishInfo())

  let ref = firestore.collection('tags').doc()
  await ref.set(tag)
  return getTag(ref.id)
}

async function updateTag(tagID, tag) {
  delete tag.id
  delete tag.publishedFrom
  delete tag.publishedAt
  delete tag.updatedAt

  tag = Object.assign(tag, getUpdateInfo())

  await firestore.collection('tags').doc(tagID).update(tag)
  return getTag(tagID)
}

async function getEvents() {
  let snapshot = await firestore.collection('events').orderBy('date', 'asc').get()
  let events = []
  if(snapshot) {
    snapshot.forEach(event => {
      events.push(Object.assign(event.data(), { id: event.id }))
    })
  }
  return events
}

async function getEvent(id) {
  let snapshot = await firestore.collection('events').doc(id).get()
  let event = null
  if(snapshot && snapshot.id && snapshot.data()) {
    event = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get event', id)
  }
  return event
}

async function addEvent(event) {
  delete event.id
  delete event.publishedFrom
  delete event.publishedAt
  delete event.updatedAt

  event = Object.assign(event, getPublishInfo())

  let ref = firestore.collection('events').doc()
  await ref.set(event)
  return getEvent(ref.id)
}

async function updateEvent(eventID, event) {
  delete event.id
  delete event.publishedFrom
  delete event.publishedAt
  delete event.updatedAt

  event = Object.assign(event, getUpdateInfo())

  await firestore.collection('events').doc(eventID).update(event)
  return getEvent(eventID)
}

async function getProjects({ pubDest = '*', activeOnly = true, desc = true, tagID = null, limit = -1 } = {}) {
  let fsRef = firestore.collection('projects')
  if(pubDest !== '*') {
    fsRef = fsRef.where('publishedTo', '==', pubDest)
  }
  if(tagID) {
    fsRef = fsRef.where('tags', 'array-contains', tagID)
  }
  if(activeOnly) {
    fsRef = fsRef.where('status', '==', 'active')
  }

  fsRef = fsRef.orderBy('publishedAt', desc ? 'desc' : 'asc')
  if(limit > 0) {
    fsRef = fsRef.limit(limit)
  }

  let snapshot = await fsRef.get()
  let projects = []
  if(snapshot) {
    snapshot.forEach(project => {
      projects.push(Object.assign(project.data(), { id: project.id }))
    })
  }
  return projects
}

async function getProject(id) {
  let snapshot = await firestore.collection('projects').doc(id).get()
  let project = null
  if(snapshot && snapshot.id && snapshot.data()) {
    project = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get project', id)
  }
  return project
}

async function getProjectBySlug(slug) {
  let projects = []
  let snapshot = await firestore.collection('projects').where('slug', '==', slug).get()
  if(snapshot) {
    snapshot.forEach(project => {
      projects.push(Object.assign({}, project.data(), { id: project.id }))
    })
  }
  return projects.length > 0 ? projects[0] : null
}

async function addProject(project) {
  delete project.id
  delete project.publishedFrom
  delete project.publishedAt
  delete project.updatedAt

  project = Object.assign(project, getPublishInfo())

  let ref = firestore.collection('projects').doc()
  await ref.set(project)
  return getProject(ref.id)
}

async function updateProject(projectID, project) {
  delete project.id
  delete project.publishedFrom
  delete project.publishedAt
  delete project.updatedAt

  project = Object.assign(project, getUpdateInfo())

  await firestore.collection('projects').doc(projectID).update(project)
  return getProject(projectID)
}

export let bunko = {
  getDocs,
  getDoc,
  getDocByContent,
  makeDoc,
  addDoc,
  updateDoc,
  getAuthors,
  getAuthor,
  addAuthor,
  updateAuthor,
  makeAuthor,
  getVideos,
  getVideo,
  addVideo,
  updateVideo,
  getCollections,
  getCollection,
  addCollection,
  updateCollection,
  getCollectionItem,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  getTags,
  getTag,
  getTagBySlug,
  addTag,
  updateTag,
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  getProjects,
  getProject,
  getProjectBySlug,
  addProject,
  updateProject
}

async function getAncms() {
  let snapshot = await firestore.collection('announcements').get()
  let ancms = []
  if(snapshot) {
    snapshot.forEach(ancm => {
      ancms.push(Object.assign(ancm.data(), { id: ancm.id }))
    })
  }
  return ancms
}

/* some helpers below */
const he = require('he')
function decode(str) {
  return str ? he.decode(str).trim() : null
}

function parseMetaContent(type, html) {
  let regExp = new RegExp('<[^a-zA-Z]*meta[^>]+' + type + '[^>]+>', 'g')
  let matches = html.match(regExp)
  matches = matches ? matches : []
  return Object.assign({}, ...matches.map(tag => {
    let match = null
    match = tag.match(/(property|name)="([^"]*)"/)
    let name = Array.isArray(match) ? match[2] : null
    match = tag.match(/content="([^"]*)"/)
    let content = Array.isArray(match) ? decode(match[1]) : null
    return name && content ? { [name]: content } : {}
  }))
}
/* some helpers above */

async function addMetadata(id, entry) {
  delete entry.id
  delete entry.publishedFrom
  delete entry.publishedAt
  delete entry.updatedAt

  entry = Object.assign(entry, getPublishInfo())

  let ref = firestore.collection('metaDictionary').doc(id)
  await ref.set(entry)
  return getMetadata(id)
}

async function updateMetadata(id, entry) {
  delete entry.id
  delete entry.publishedFrom
  delete entry.publishedAt
  delete entry.updatedAt

  entry = Object.assign(entry, getUpdateInfo())

  let ref = firestore.collection('metaDictionary').doc(id)
  await ref.set(entry)
  return getMetadata(id)
}

async function getMetadata(id) {
  let snapshot = await firestore.collection('metaDictionary').doc(id).get()
  let entry = null
  if(snapshot && snapshot.id && snapshot.data()) {
    entry = Object.assign(snapshot.data(), { id: snapshot.id })
  } else {
    console.error('Cannot get metadata', id)
  }
  return entry
}

const ttl = 1000 * 60 * 60 * 24 // 1 day
const scraper = axios.create({
  timeout: 4000
})
async function scrapeMetadata(url, cacheFirst = true) {
  let id = Buffer.from(url).toString('base64')
  let entry = null
  let upToDate = true
  if(cacheFirst) {
    entry = await getMetadata(id)
    if(entry) {
      let pubTS = fsTSToDateObj(entry.updatedAt ? entry.updatedAt : entry.publishedAt).getTime()
      let now = (new Date()).getTime()
      if(now - pubTS > ttl) {
        upToDate = false
      }
    }
  }
  if(!(entry && upToDate)) {
    if(!upToDate) {
      console.info('Metadata out of date')
    }
    console.info('Fetch metadata from source', url)
    let head = null
    let title = null
    let titles = null
    let image = null
    let images = null
    let descriptions = null
    try {
      let response = await scraper.get(url)
      let html = response.data
      html = html.replace(/(?:\r\n|\r|\n)/g, '')
      head = html.match(/<head>(.*)<\/head>/)
      head = Array.isArray(head) ? head[1] : null
    } catch(error) {
      console.error(error.message)
    }
    if(head) {
      title = head.match(/<\s*title[^>]*>(.*)<\/title>/)
      title = Array.isArray(title) ? decode(title[1]) : null
      title = title ? title : url
      titles = parseMetaContent('title', head)
      descriptions = parseMetaContent('description', head)
      images = parseMetaContent('image', head)
      image = images['twitter:image'] ? images['twitter:image'] : (images['og:image'] ? images['og:image'] : null)
    }

    let newEntry = {
      url,
      title,
      titles,
      image,
      images,
      descriptions
    }
    if(entry && !upToDate) {
      console.log('Update metadata', id)
      entry = await updateMetadata(id, newEntry)
    } else {
      console.log('Add metadata', id)
      entry = await addMetadata(id, newEntry)
    }
  }
  return entry
}

export let watchout = {
  getAncms,
  scrapeMetadata
}
