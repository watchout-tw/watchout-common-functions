import defaultImage from 'watchout-common-assets/images/default.gif'

const WHATPORT = {
  park: 9487,
  watchout: 9000,
  ask: 9010,
  musou: 9020
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
    getBaseURL(channelID, forceProductionURL = false) {
      let protocol = 'https://'
      let url = protocol + (channelID === 'watchout' ? 'watchout.tw/' : `${channelID}.watchout.tw/`)
      if(process.broswer && window && !forceProductionURL) {
        const currentURL = window.location.hostname
        let port = WHATPORT[channelID]
        if(!port) {
          console.warn('getBaseURL: Service at unknown port.')
        } else if(currentURL.includes('localhost')) {
          protocol = 'http://'
          url = `${protocol}dev.localhost:${port}/`
        } else if(currentURL.split('.')[0] === 'beta') {
          url = protocol + (channelID === 'watchout' ? 'beta.watchout.tw/' : `beta.${channelID}.watchout.tw/`)
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
    },
    getMusouProjectURL(moduleID, projectID) {
      return this.getBaseURL('musou') + moduleID + '/' + projectID
    },
    generateMeta(channelID, pageTitle, pageDescription, image = defaultImage) {
      let baseURL = this.getBaseURL(channelID, true)
      image = baseURL + (image.substring(0, 1) === '/' ? image.substring(1) : image)
      return [
        {
          hid: 'description',
          name: 'description',
          content: pageDescription
        },
        {
          vmid: 'og-type',
          property: 'og:type',
          content: 'website'
        },
        {
          vmid: 'og-title',
          property: 'og:title',
          content: pageTitle
        },
        {
          vmid: 'og-description',
          property: 'og:description',
          content: pageDescription
        },
        {
          vmid: 'og-image',
          property: 'og:image',
          content: image
        },
        {
          vmid: 'twitter-card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          vmid: 'twitter-title',
          name: 'twitter:title',
          content: pageTitle
        },
        {
          vmid: 'twitter-description',
          name: 'twitter:description',
          content: pageDescription
        },
        {
          vmid: 'twitter-image',
          name: 'twitter:image',
          content: image
        }
      ]
    }
  }
}
