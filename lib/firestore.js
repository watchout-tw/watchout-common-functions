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

async function doPublishGhostDoc(doc, destination) {
  let docContent = doc.content
  doc.content = { id: doc.content.id }

  let docRef = null
  let date = new Date()
  let snapshot = await firestore.collection('docs').where('type', '==', 'ghost').where('content.id', '==', doc.content.id).get()
  if(snapshot && snapshot.size === 0) {
    doc.status = 'active'
    doc.publishedFrom = 'firestore'
    doc.publishedTo = destination
    doc.publishedAt = date
    docRef = await firestore.collection('docs').add(doc)
  } else if(snapshot && snapshot.size > 0) {
    snapshot.forEach(docInSnapshot => {
      if(!docRef) {
        docRef = docInSnapshot.ref
      }
    })
    if(docRef) {
      docRef.update({
        updatedAt: date,
        title: doc.title
      })
    }
  }
  if(docRef) {
    docRef.collection('versions').add({
      date,
      content: docContent
    })
  }
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
  updateDoc,
  getDocByContent,
  doPublishGhostDoc
}
