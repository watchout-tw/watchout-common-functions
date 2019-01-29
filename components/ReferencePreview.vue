<template>
<div class="reference-preview" :class="{ disabled: !isActive }">
  <div class="preview text tcl-container" v-if="display === 'text'">
    <div class="tcl-panel">
      <h3 v-html="spacingOptimizer(internalTitle)"></h3>
    </div>
    <div class="tcl-panel"></div>
  </div>
  <div class="preview image" v-else-if="display === 'image'">
    <a :href="linkURL" class="image" :aspect-ratio="imageRatio" :style="imageStyles"></a>
    <div v-if="isActive" class="more font-size-small text-align-right secondary-text margin-top-bottom-4"><a :href="linkURL" class="a-text" :class="readMoreClasses">{{ readMoreText }}</a></div>
  </div>
  <div class="preview vertical" v-else-if="display === 'vertical'">
    <a :href="linkURL" class="image" :aspect-ratio="imageRatio" :style="imageStyles"></a>
    <h3 class="title margin-top-bottom-8" :class="{ 'text-align-center': align === 'center' }"><a :href="linkURL" class="a-text" v-html="spacingOptimizer(internalTitle)"></a></h3>
    <div class="description margin-top-bottom-8">{{ internalDescription }}</div>
    <div v-if="isActive" class="more margin-top-bottom-8" :class="{ 'text-align-center': align === 'center' }"><a :href="linkURL" class="button" :class="readMoreClasses">{{ readMoreText }}</a></div>
  </div>
  <div class="preview default tcl-container" v-else>
    <a :href="linkURL" class="image tcl-panel tcl-left-right-margin with-top-bottom-margin" :aspect-ratio="imageRatio" :style="imageStyles"></a>
    <div class="summary tcl-panel tcl-left-right-margin with-top-bottom-margin">
      <h3 class="title"><a :href="linkURL" class="a-text" v-html="spacingOptimizer(internalTitle)"></a></h3>
      <div class="description margin-top-bottom-8">{{ internalDescription }}</div>
      <div v-if="isActive" class="more margin-top-bottom-8"><a :href="linkURL" class="button" :class="readMoreClasses">{{ readMoreText }}</a></div>
    </div>
  </div>
</div>
</template>

<script>
import { parseReference } from 'watchout-common-functions/lib/watchout'
import { knowsBunko } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsBunko],
  props: ['reference', 'data', 'display', 'align', 'imageRatio', 'imageSize', 'image', 'link', 'title', 'description', 'readMore', 'readMoreStyle', 'channel', 'status'],
  computed: {
    doc() {
      return this.reference ? this.data[this.reference.url] : null
    },
    docID() {
      return this.doc ? this.doc.id : null
    },
    internalTitle() {
      return this.doc ? this.doc.title : this.title
    },
    internalDescription() {
      return this.doc ? this.doc.description : this.description
    },
    readMoreText() {
      return this.readMore ? this.readMore : '閱讀更多'
    },
    readMoreClasses() {
      let classes = this.channel ? [this.channel] : ['watchout']
      if(this.readMoreStyle === 'large') {
        classes.push('large')
      } else {
        classes.push('medium')
      }
      return classes
    },
    imageStyles() {
      let styles = {}
      let ref = this.doc ? parseReference(this.doc.image) : null
      let url = ref ? ref.permalink : this.image
      styles.backgroundImage = `url(${url})`

      if(this.align === 'center') {
        styles.margin = '0 auto'
      }
      if(this.imageSize) {
        styles.maxWidth = this.imageSize
      }
      return styles
    },
    isActive() {
      return this.status !== 'disabled'
    },
    linkURL() {
      return this.isActive ? (this.reference ? this.reference.permalink : this.link) : null
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.reference-preview {
  &.disabled {
    filter: grayscale(100%);
    opacity: 0.5;
  }
  > .preview {
    > .image {
      @include rect(2/1);
      &[aspect-ratio = 'square'] {
        @include rect(1/1);
      }
      &[aspect-ratio = '16:9'] {
        @include rect(16/9);
      }
      &[aspect-ratio = '3:2'] {
        @include rect(3/2);
      }
      background-size: cover;
      background-position: center center;
      @include shadow;
    }
  }
}
</style>
