<template>
<component :is="tagName" class="ghost-markup" v-html="html"></component>
</template>

<script>
export default {
  props: ['tagName', 'markers', 'atoms', 'markups'],
  computed: {
    html() {
      return this.markers.map(marker => {
        // FIXME: partial implementation assumes markupsInUse has 1 at most
        let html = ''
        let beforeValue = ''
        let afterValue = ''
        let markupsInUse = marker[1]
        let value = marker[3]
        if(markupsInUse.length > 0) {
          let index = markupsInUse[0]
          let [tagName, ...attributes] = this.markups[index]
          if(tagName === 'a') {
            attributes.push(['class', 'a-text'])
          }
          attributes = attributes.map(attr => `${attr[0]}="${attr[1]}"`)
          beforeValue = `<${[tagName, ...attributes].join(' ')}>`
          afterValue = `</${tagName}>`
        }
        if(typeof value === 'string') { // text
          html = `${beforeValue}${value}${afterValue}`
        } else if(Number.isInteger(value)) { // atom
          // TODO: convert atoms into HTML
        }
        return html
      }).join('')
    }
  }
}
</script>
