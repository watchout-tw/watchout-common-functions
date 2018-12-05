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

async function getDoc(type, id) {
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

async function togglePublishDoc(ghostDoc, isPublished) {
  let snapshot = await firestore.collection('docs').where('ghostID', '==', ghostDoc.id).get()
  let date = new Date()
  if(snapshot) {
    if(snapshot.size === 0) {
      if(isPublished) {
        let firestoreDoc = {
          ghostID: ghostDoc.id,
          isPublished,
          publishedAt: date,
          updatedAt: date,
          title: ghostDoc.title
        }
        let firestoreDocRef = await firestore.collection('docs').add(firestoreDoc)
        firestoreDocRef.collection('versions').add({
          date: date,
          ghost: ghostDoc
        })
        // doc added (id = ref.id)
      }
    } else {
      snapshot.forEach(doc => {
        let firestoreDocRef = doc.ref
        firestoreDocRef.update({ isPublished })
        if(isPublished) {
          firestoreDocRef.update({
            updatedAt: date,
            title: ghostDoc.title
          })
          firestoreDocRef.collection('versions').add({
            date: date,
            ghost: ghostDoc
          })
        }
        // doc updated (id = ref.id)
      })
    }
  }
}

export let bunko = {
  getDocs,
  getDoc,
  togglePublishDoc
}
