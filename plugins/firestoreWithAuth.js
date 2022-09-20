import * as core from 'watchout-common-functions/lib/core'
import * as firestore from 'watchout-common-functions/lib/firestore'

// initialize firestore
export default async function({ store, router }) {
  // init
  await firestore.sys.initWithAuth(store)

  // cache
  let [authors, tags] = await Promise.all([
    core.getAuthors(),
    core.getTags()
  ])
  store.commit('fsCache/setAuthors', authors.data.rows)
  store.commit('fsCache/setTags', tags.data.rows)
}
