import defaultImage from 'watchout-common-assets/images/default.gif'

export function generateMeta(pageTitle, pageDescription, image = defaultImage) {
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
