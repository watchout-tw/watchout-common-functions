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
  let snapshot = await firestore.collection('docs').get()
  let docs = []
  if(snapshot) {
    snapshot.forEach(doc => {
      docs.push({
        id: doc.id,
        data: doc.data()
      })
    })
  }
  return docs
}

export default {
  bunko: {
    getDocs
  }
}
