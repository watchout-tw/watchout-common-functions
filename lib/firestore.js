import firebaseConfig from 'watchout-common-functions/config/firebase.config'
import firebase from 'firebase/app'
import 'firebase/firestore'

if(firebase.apps.length < 1) {
  firebase.initializeApp(firebaseConfig.projects.bunko)
}

let firestore = firebase.firestore()
firestore.settings(firebaseConfig.db)

// bunko functions

async function getDocs() {
  let snapshot = await firestore.collection('docs').orderBy('publishedAt', 'asc').get()
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
    snapshot = await firestore.collection('docs').where('type', '==', type).where('content.id', '==', id).get()
    if(snapshot) {
      snapshot.forEach(doc => {
        docs.push(Object.assign(doc.data(), { id: doc.id }))
      })
    }
  }
  return docs.length > 0 ? docs[0] : null
}

async function updateDoc(docID, doc) {
  doc = Object.assign(doc, {
    updatedAt: new Date()
  })
  await firestore.collection('docs').doc(docID).update(doc)
  let newDoc = null
  let snapshot = await firestore.collection('docs').doc(docID).get()
  if(snapshot) {
    newDoc = Object.assign(snapshot.data(), { id: snapshot.id })
  }
  return newDoc
}

function makeDoc(type, rawDoc, status = 'active') {
  let doc = { type }
  if(type === 'ghost') {
    doc.content = { id: rawDoc.id }
    doc.status = status
    doc.title = rawDoc.title
    doc.image = rawDoc.feature_image ? rawDoc.feature_image : null
    doc.description = rawDoc.custom_excerpt ? rawDoc.custom_excerpt : null
    doc.tags = rawDoc.tags ? rawDoc.tags : []
  }
  return doc
}

function getPublishInfo(destination, date = new Date()) {
  return {
    publishedFrom: 'firestore',
    publishedTo: destination,
    publishedAt: date
  }
}

function getUpdateInfo(date = new Date()) {
  return {
    updatedAt: date
  }
}

async function publishDoc(doc, destination) {
  let date = new Date()
  let docContent = doc.content
  doc.content = { id: doc.content.id }

  let docRef = null
  // check if doc is already published
  let snapshot = null
  if(doc.type === 'ghost') {
    snapshot = await firestore.collection('docs').where('type', '==', 'ghost').where('content.id', '==', doc.content.id).get()
  }
  if(snapshot && snapshot.size === 0) {
    // add doc
    docRef = await firestore.collection('docs').add(Object.assign(doc, getPublishInfo(destination, date)))
  } else if(snapshot && snapshot.size > 0) {
    // update doc
    snapshot.forEach(docInSnapshot => {
      if(!docRef) {
        docRef = docInSnapshot.ref
      }
    })
    if(docRef) {
      docRef.update(getUpdateInfo(date))
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

export let bunko = {
  getDocs,
  getDoc,
  getDocByContent,
  updateDoc,
  makeDoc,
  publishDoc
}
