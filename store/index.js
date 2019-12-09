export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) { // 1. store { commit, dispatch, ... } 2. context
    console.info('[nuxt server init]')
    // get user info server-side
  }
}
