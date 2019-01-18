import firebaseConfig from 'watchout-common-functions/config/firebase.config'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { defaultPubDest, authorTypes, parseReference, makeReference } from 'watchout-common-functions/lib/bunko'
import * as core from 'watchout-common-functions/lib/core'

if(firebase.apps.length < 1) {
  firebase.initializeApp(firebaseConfig.projects.bunko)
}

let firestore = firebase.firestore()
firestore.settings(firebaseConfig.db)

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

async function getDocs({ pubDest = '*', activeOnly = true } = {}) {
  let fsRef = firestore.collection('docs').orderBy('publishedAt', 'desc')
  if(pubDest !== '*') {
    fsRef = fsRef.where('publishedTo', '==', pubDest)
  }
  if(activeOnly) {
    fsRef = fsRef.where('status', '==', 'active')
  }
  let snapshot = await fsRef.get()
  let docs = []
  if(snapshot) {
    snapshot.forEach(doc => {
      docs.push(Object.assign(doc.data(), { id: doc.id }))
    })
  }
  return docs
}

async function getDoc(id, withContent = false) {
  let snapshot = await firestore.collection('docs').doc(id).get()
  let doc = null
  if(snapshot) {
    doc = Object.assign(snapshot.data(), { id: snapshot.id })
  }
  if(doc && withContent) {
    let contentSnapshot = await firestore.collection('docs').doc(id).collection('versions').orderBy('date', 'desc').limit(1).get()
    if(contentSnapshot) {
      contentSnapshot.forEach(docInSnapshot => {
        doc.content = docInSnapshot.data().content
      })
    }
  }
  return doc
}

async function getDocByContent(type, id) {
  let snapshot
  let docs = []
  if(type === 'firestore') {
    snapshot = await firestore.collection('docs').doc(id).get()
    if(snapshot) {
      docs.push(Object.assign(snapshot.data(), { id: snapshot.id }))
    }
  } else if(type === 'ghost') {
    snapshot = await firestore.collection('docs').where('reference', '==', makeReference(type, id)).get()
    if(snapshot) {
      snapshot.forEach(doc => {
        docs.push(Object.assign(doc.data(), { id: doc.id }))
      })
    }
  }
  return docs.length > 0 ? docs[0] : null
}

async function updateDoc(docID, doc) {
  await firestore.collection('docs').doc(docID).update(Object.assign(doc, getUpdateInfo()))
  return getDoc(docID, true)
}

function makeDoc(type, rawDoc, cachedAuthors, status = 'active') {
  let doc = Object.assign(...authorTypes.map(type => ({ [type.valuePlural]: [] })))
  doc.authors = rawDoc.authors.map(rawAuthor => {
    let personaID = null
    let rawID = rawAuthor.id
    let author = cachedAuthors.find(author => parseReference(author.reference).id === rawID)
    if(author) {
      personaID = author.persona
    }
    return personaID
  }).filter(authorID => authorID !== null)
  if(type === 'ghost') {
    doc.reference = makeReference(type, rawDoc.id)
    doc.content = rawDoc
    doc.status = status
    doc.title = rawDoc.title
    doc.image = rawDoc.feature_image ? makeReference('ghost-asset', rawDoc.feature_image) : null
    doc.description = rawDoc.custom_excerpt ? rawDoc.custom_excerpt : null
    doc.tags = []
    doc.publishedTo = defaultPubDest.value
  }
  return doc
}

async function publishDoc(doc) {
  let date = new Date()
  let docType = parseReference(doc.reference).type
  let docRef = null
  let docContent = doc.content
  delete doc.content

  // check if doc is already published
  let snapshot = null
  if(docType === 'ghost') {
    snapshot = await firestore.collection('docs').where('reference', '==', doc.reference).get()
  }
  // add or update doc
  if(snapshot && snapshot.size === 0) {
    // add doc
    docRef = await firestore.collection('docs').add(Object.assign(doc, getPublishInfo(date)))
  } else if(snapshot && snapshot.size > 0) {
    // update doc
    snapshot.forEach(docInSnapshot => {
      if(!docRef) {
        docRef = docInSnapshot.ref
      }
    })
    if(docRef) {
      docRef.update(Object.assign(doc, getUpdateInfo(date)))
    }
  }
  if(docRef) {
    docRef.collection('versions').add({
      date,
      content: docContent
    })
  }
  // get latest version of doc
  let result = null
  if(docRef) {
    let docSnapshot = await docRef.get()
    result = Object.assign(docSnapshot.data(), { id: docSnapshot.id })

    let contentSnapshot = await docRef.collection('versions').orderBy('date', 'desc').limit(1).get()
    if(contentSnapshot) {
      contentSnapshot.forEach(docInSnapshot => {
        result.content = docInSnapshot.data().content
      })
    }
  }
  return result
}

async function getAuthors() {
  let snapshot = await firestore.collection('authors').get()
  let authors = []
  if(snapshot) {
    snapshot.forEach(author => {
      authors.push(Object.assign(author.data(), { id: author.id }))
    })
  }
  authors.sort((a, b) => ('' + a.name).localeCompare(b.name))

  // get personas
  for(let i = 0; i < authors.length; i++) {
    let personaID = authors[i].persona
    let persona = await core.getPersona(personaID)
    persona = persona.data
    authors[i].personaObj = Object.keys(persona).length > 0 ? persona : null
  }
  return authors
}

async function getAuthor(id) {
  let snapshot = await firestore.collection('authors').doc(id).get()
  let author = null
  if(snapshot) {
    author = Object.assign(snapshot.data(), { id: snapshot.id })
  }
  return author
}

async function addAuthor(author) {
  let ref = firestore.collection('authors').doc()
  await ref.set(Object.assign(author, getPublishInfo()))
  return ref.id
}

async function updateAuthor(authorID, author) {
  await firestore.collection('authors').doc(authorID).update(Object.assign(author, getUpdateInfo()))
  // TODO: return updated author?
}

function makeAuthor(rawAuthor, type) {
  let author = {
    persona: null,
    reference: null
  }
  if(rawAuthor) {
    author.reference = makeReference(type, rawAuthor.id)
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
  return videos
}

async function getVideo(id) {
  let snapshot = await firestore.collection('videos').doc(id).get()
  let video = null
  if(snapshot) {
    video = Object.assign(snapshot.data(), { id: snapshot.id })
  }
  return video
}

async function addVideo(video) {
  let ref = firestore.collection('videos').doc()
  await ref.set(Object.assign(video, getPublishInfo()))
  return ref.id
}

async function updateVideo(videoID, video) {
  await firestore.collection('videos').doc(videoID).update(Object.assign(video, getUpdateInfo()))
  // TODO: return updated video?
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
  if(snapshot) {
    collection = Object.assign(snapshot.data(), { id: snapshot.id })
  }
  if(collection && withItems) {
    let itemsSnapshot = await firestore.collection('collections').doc(id).collection('items').orderBy('index', 'asc').get()
    let items = []
    if(itemsSnapshot) {
      itemsSnapshot.forEach(item => {
        items.push(Object.assign(item.data(), { id: item.id }))
      })
    }
    collection.items = items
  }
  return collection
}

async function addCollection(collection) {
  let ref = firestore.collection('collections').doc()
  await ref.set(Object.assign(collection, getPublishInfo()))
  return ref.id
}

async function updateCollection(collectionID, collection) {
  await firestore.collection('collections').doc(collectionID).update(Object.assign(collection, getUpdateInfo()))
  // TODO: return updated collection?
}

async function addCollectionItem(collectionID, item) {
  let ref = firestore.collection('collections').doc(collectionID).collection('items').doc()
  await ref.set(Object.assign(item, getPublishInfo()))
  return ref.id
}

async function updateCollectionItem(collectionID, itemID, item) {
  await firestore.collection('collections').doc(collectionID).collection('items').doc(itemID).update(Object.assign(item, getUpdateInfo()))
  // TODO: return updated collection item?
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
  if(snapshot) {
    tag = Object.assign(snapshot.data(), { id: snapshot.id })
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
  let ref = firestore.collection('tags').doc()
  await ref.set(Object.assign(tag, getPublishInfo()))
  return ref.id
}

async function updateTag(tagID, tag) {
  await firestore.collection('tags').doc(tagID).update(Object.assign(tag, getUpdateInfo()))
  // TODO: return updated video?
}

export let bunko = {
  getDocs,
  getDoc,
  getDocByContent,
  updateDoc,
  makeDoc,
  publishDoc,
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
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  getTags,
  getTag,
  getTagBySlug,
  addTag,
  updateTag
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

export let watchout = {
  getAncms
}
