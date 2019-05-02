<template>
<div class="comp-collection margin-top-bottom-single">
  <h4 class="title section-title with-underline text-align-center margin-top-bottom-8" v-if="title"><span>{{ title }}</span></h4>
  <template v-if="display === 'list'">
    <div class="items list tcl-container no-margin" v-if="items">
      <div class="item list-item tcl-panel tcl-left-right-margin with-top-bottom-margin" v-for="(item, index) of items" :key="`item-${index}`">
        <template v-if="item && item.type === 'reference'">
          <div class="markdown paragraphs no-margin a-text-parent" v-html="markdown((index + 1) + '.')"></div>
          <comp-infobox :id="item.referenceObj.id" :data="data" display="minimal" />
        </template>
        <template v-else>
          <div class="markdown paragraphs no-margin a-text-parent" v-html="markdown(item.markdown)"></div>
        </template>
        <div class="links margin-top-bottom-single">
          <reference-preview class="link" :reference="link.referenceObj" :data="data" display="horizontal" :image="getItemLinkImage(link)" :title="link.title" :h="4" :read-more-style="null" :show-pub-dest="true" v-for="(link, linkIndex) of item.links" :key="`links-${linkIndex}`" :cachedAuthors="cachedAuthors" />
        </div>
      </div>
      <div class="tcl-panel"></div>
    </div>
  </template>
  <template v-else>
    <div class="items grid tcl-container no-margin" v-if="items">
      <div class="item grid-item tcl-panel half-width" v-for="(item, index) of items" :key="`item-${index}`">
        <reference-preview :reference="item.referenceObj" :data="data" display="vertical" :image="getItemImage(item)" :title="item.title" :h="4" :description="null" :read-more-style="null" :show-pub-dest="true" :cachedAuthors="cachedAuthors" />
      </div>
      <div class="tcl-panel half-width"></div>
      <div class="tcl-panel half-width"></div>
      <div class="tcl-panel half-width"></div>
    </div>
  </template>
</div>
</template>

<script>
import { knowsMarkdown, knowsWatchout } from 'watchout-common-functions/interfaces'
import { parseReference, makeReference } from 'watchout-common-functions/lib/watchout'
import ReferencePreview from 'watchout-common-functions/components/ReferencePreview'
import CompInfobox from 'watchout-common-functions/components/comp/Infobox'

export default {
  mixins: [knowsMarkdown, knowsWatchout],
  props: ['id', 'data', 'collection', 'display', 'cachedAuthors'],
  computed: {
    referenceObj() {
      return makeReference('collection', this.id)
    },
    internalCollection() {
      return this.collection ? this.collection : (this.data ? this.data[this.referenceObj.url] : null)
    },
    title() {
      return this.internalCollection ? this.internalCollection.title : null
    },
    items() {
      // FIXME: id + data: proper collection / collection: custom collection
      // reconcile different data source
      // optimize data fetching and parsing
      return this.internalCollection ? this.internalCollection.items.map(item => {
        let content = this.data ? this.data[item.reference] : null
        let publishedTo = content ? content.publishedTo : null
        return Object.assign({}, item, {
          referenceObj: parseReference(item.reference, { publishedTo }),
          content
        })
      }) : null
    }
  },
  methods: {
    getItemImage(item) {
      let image = null
      if(item.content && item.content.hasOwnProperty('image') && typeof item.content.image === 'string') {
        let reference = parseReference(item.content.image)
        image = reference ? reference.permalink : null
      } else if(item.content && Array.isArray(item.content.images) && item.content.images.length > 0) {
        image = item.content.images[0]
      }
      return image
    },
    getItemLinkImage(link) {
      let image = null
      let data = this.data[link.referenceObj.url]
      if(data && Array.isArray(data.images) && data.images.length > 0) {
        image = data.images[0]
      }
      return image
    }
  },
  components: {
    ReferencePreview,
    CompInfobox
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-collection {
  > .list {
    > .list-item {
      > .links {
        > .link:not(:last-child) {
          margin-bottom: 0.875rem;
        }
      }
    }
  }
  > .grid {
    > .grid-item {}
  }
}
</style>
