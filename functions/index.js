import defaultImage from 'watchout-common-assets/images/default.gif'

export function generateMeta(pageTitle, pageDescription, image = defaultImage) {
  return [
    {
      name: 'description',
      content: pageDescription
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
    }
  ]
}
