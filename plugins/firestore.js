import * as firestore from 'watchout-common-functions/lib/firestore'

// initialize firestore
export default async function({ store, router }) {
  // init
  await firestore.sys.init(store)

  // cache
  let [authors, tags] = await Promise.all([
    firestore.bunko.getAuthors(),
    firestore.bunko.getTags()
  ])
  store.commit('fsCache/setAuthors', authors)
  store.commit('fsCache/setTags', tags)
}
