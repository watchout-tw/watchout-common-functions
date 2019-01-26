import defaultImage from 'watchout-common-assets/images/default.gif'
import env from 'watchout-common-assets/environment'

import { getBaseURL, getCompDocURL, getCompVideoURL } from 'watchout-common-functions/lib/watchout'

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
    getName(id) {
      return env.channels.hasOwnProperty(id) ? env.channels[id].name : '找不到名字'
    },
    getBaseURL,
    getCompDocURL,
    getCompVideoURL,
    getLabRepURL(repID) {
      return this.getBaseURL('lab') + `reps/${repID}`
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
    getWatchoutProjectURL(projectID) {
      return this.getBaseURL('watchout') + `projects/${projectID}`
    },
    generateMeta(channelID, pageTitle, pageDescription, image = defaultImage) {
      let baseURL = this.getBaseURL(channelID)
      image = baseURL + (image.substring(0, 1) === '/' ? image.substring(1) : image)
      return [
        {
          hid: 'description',
          name: 'description',
          content: pageDescription
        },
        {
          vmid: 'og-type',
          name: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          vmid: 'og-title',
          name: 'og:title',
          property: 'og:title',
          content: pageTitle
        },
        {
          vmid: 'og-description',
          name: 'og:description',
          property: 'og:description',
          content: pageDescription
        },
        {
          vmid: 'og-image',
          name: 'og:image',
          property: 'og:image',
          content: image
        },
        {
          vmid: 'twitter-card',
          name: 'twitter:card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          vmid: 'twitter-title',
          name: 'twitter:title',
          property: 'twitter:title',
          content: pageTitle
        },
        {
          vmid: 'twitter-description',
          name: 'twitter:description',
          property: 'twitter:description',
          content: pageDescription
        },
        {
          vmid: 'twitter-image',
          name: 'twitter:image',
          property: 'twitter:image',
          content: image
        }
      ]
    }
  }
}
