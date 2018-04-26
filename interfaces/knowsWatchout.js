const WHATPORT = {
  park: 9487,
  watchout: 9000,
  ask: 9010,
  'musou-media-experiment': 9020
}

export default {
  methods: {
    getSmallProjectLogo(id) {
      return require('watchout-common-assets/images/logo/' + id + '/small.png')
    },
    getLargeProjectLogo(id) {
      return require('watchout-common-assets/images/logo/' + id + '/large.png')
    },
    getProjectLogoWithType(id) {
      return require('watchout-common-assets/images/logo+type/' + id + '/regular.png')
    },
    getProjectLogoWithTypeStyles(id) {
      const metadata = require('watchout-common-assets/images/logo+type/metadata').default[id]
      return {
        width: metadata.width + 'px',
        height: metadata.height + 'px'
      }
    },
    getBaseURL(channelID) {
      const protocol = '//'
      let url = `${protocol}${channelID}.watchout.tw/`
      if(process.broswer && window) {
        const currentURL = window.location.hostname
        let port = WHATPORT[channelID]
        if(!port) {
          console.error('What port?')
        } else if(currentURL.includes('localhost')) {
          url = `${protocol}dev.localhost:${port}/`
        } else if(currentURL.split('.')[0] === 'beta') {
          url = `${protocol}beta.${channelID}.watchout.tw/`
        }
      }
      return url
    },
    getAskGameURL(gameSlug) {
      return this.getBaseURL('ask') + `games/${gameSlug}`
    },
    getAskQuestionURL(gameSlug, questionID) {
      return this.getBaseURL('ask') + `games/${gameSlug}/questions/${questionID}`
    },
    getAskAnswerURL(gameSlug, answerID) {
      return this.getBaseURL('ask') + `games/${gameSlug}/answers/${answerID}`
    },
    getParkPersonaProfileURL(personaID) {
      return this.getBaseURL('park') + `personas/${personaID}`
    },
    getParkSettingsURL() {
      return this.getBaseURL('park') + 'settings'
    }
  }
}
