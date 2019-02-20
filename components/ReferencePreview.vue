<template>
<div class="reference-preview" :class="{ disabled: !isActive }">
  <div class="preview text tcl-container" v-if="display === 'text'">
    <div class="tcl-panel">
      <component :is="titleTag" v-html="spacingOptimizer(internalTitle)"></component>
    </div>
    <div class="tcl-panel"></div>
  </div>
  <div class="preview image" v-else-if="display === 'image'">
    <a :href="linkURL" class="image margin-bottom-8" :aspect-ratio="imageRatio" :style="imageStyles"></a>
    <div v-if="isActive && showReadMore" class="more text-align-right"><a :href="linkURL" :class="readMoreClasses">{{ readMoreText }}</a></div>
  </div>
  <div class="preview forward" v-else-if="display === 'forward'" :class="previewClasses">
    <a :href="linkURL" class="image" :aspect-ratio="imageRatio" :style="imageStyles">
      <div v-if="showPubDest" class="pub-dest-logo" :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"></div>
    </a>
    <component :is="titleTag" class="title margin-top-bottom-8"><a :href="linkURL" class="a-text text-color-musou" v-html="spacingOptimizer(internalTitle)"></a></component>
    <a :href="linkURL" class="hand-container"><img class="hand" :src="hand" /></a>
  </div>
  <div class="preview vertical" v-else-if="display === 'vertical'" :class="previewClasses">
    <a :href="linkURL" class="image" :aspect-ratio="imageRatio" :style="imageStyles">
      <div v-if="showPubDest" class="pub-dest-logo" :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"></div>
    </a>
    <component :is="titleTag" class="title margin-top-bottom-8"><a :href="linkURL" class="a-text" v-html="spacingOptimizer(internalTitle)"></a></component>
    <div class="description" v-if="internalDescription">{{ internalDescription }}</div>
    <div v-if="isActive && showReadMore" class="more margin-top-bottom-4"><a :href="linkURL" :class="readMoreClasses">{{ readMoreText }}</a></div>
  </div>
  <div class="preview horizontal" v-else-if="display === 'horizontal'" :class="previewClasses">
    <a :href="linkURL" class="image" :aspect-ratio="imageRatio" :style="imageStyles">
      <div v-if="showPubDest" class="pub-dest-logo" :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"></div>
    </a>
    <div class="summary">
      <component :is="titleTag" class="title margin-bottom-8"><a :href="linkURL" class="a-text" v-html="spacingOptimizer(internalTitle)"></a></component>
      <div class="description" v-if="internalDescription">{{ internalDescription }}</div>
      <div v-if="isActive && showReadMore" class="more margin-top-bottom-4"><a :href="linkURL" :class="readMoreClasses">{{ readMoreText }}</a></div>
    </div>
  </div>
  <div class="preview default" :class="containerClasses" v-else><!-- default is flexible -->
    <a :href="linkURL" class="image" :class="panelClasses" :aspect-ratio="imageRatio" :style="imageStyles">
      <div v-if="showPubDest" class="pub-dest-logo" :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"></div>
    </a>
    <div class="summary" :class="panelClasses">
      <component :is="titleTag" class="title margin-bottom-8"><a :href="linkURL" class="a-text" v-html="spacingOptimizer(internalTitle)"></a></component>
      <div class="description" v-if="internalDescription">{{ internalDescription }}</div>
      <div v-if="isActive && showReadMore" class="more margin-top-bottom-4"><a :href="linkURL" :class="readMoreClasses">{{ readMoreText }}</a></div>
    </div>
  </div>
</div>
</template>

<script>
import { parseReference } from 'watchout-common-functions/lib/watchout'
import { knowsBunko, knowsWatchout } from 'watchout-common-functions/interfaces'
import hand from 'watchout-common-assets/images/hand.svg'

export default {
  mixins: [knowsBunko, knowsWatchout],
  props: ['reference', 'data', 'display', 'align', 'imageRatio', 'imageSize', 'imageStyle', 'image', 'link', 'title', 'h', 'description', 'readMore', 'readMoreStyle', 'showPubDest', 'status'],
  data() {
    return {
      hand
    }
  },
  computed: {
    doc() {
      return this.reference ? this.data[this.reference.url] : null
    },
    docID() {
      return this.doc ? this.doc.id : null
    },
    internalTitle() {
      return this.title ? this.title : (this.doc ? this.doc.title : '標題未定')
    },
    internalDescription() {
      return this.description === null ? null : (this.doc ? this.doc.description : this.description)
    },
    containerClasses() {
      return this.display === 'tcl' ? ['tcl-container'] : ['container']
    },
    panelClasses() {
      return this.display === 'tcl' ? ['tcl-panel', 'tcl-left-right-margin', 'with-top-bottom-margin'] : ['panel']
    },
    titleTag() {
      return `h${parseInt(this.h) ? parseInt(this.h) : 3}`
    },
    pubDestLogo() {
      return this.getSmallProjectLogo(this.doc && this.doc.publishedTo ? this.doc.publishedTo : 'external')
    },
    showReadMore() {
      return this.readMoreStyle !== null
    },
    readMoreText() {
      return this.readMore ? this.readMore : '閱讀更多'
    },
    readMoreClasses() {
      let classes = []
      if(this.readMoreStyle === 'button') {
        classes.push(...['button', 'medium'])
      } else {
        classes.push(...['a-text', 'font-size-small', 'secondary-text'])
      }
      classes.push(this.showPubDest && this.doc && this.doc.publishedTo ? this.doc.publishedTo : 'watchout')
      return classes
    },
    imageStyles() {
      let styles = {}
      let ref = this.doc ? parseReference(this.doc.image) : null
      let url = ref ? ref.permalink : this.image
      styles.backgroundImage = `url(${url})`
      styles.maxWidth = this.imageSize ? this.imageSize : null
      return styles
    },
    previewClasses() {
      let classes = this.showPubDest && this.doc && this.doc.publishedTo ? [this.doc.publishedTo] : ['watchout']
      if(this.align === 'center') {
        classes.push('align-center')
      }
      return classes
    },
    isActive() {
      return this.status !== 'disabled'
    },
    linkURL() {
      return this.isActive ? (this.link ? this.link : (this.reference && this.reference.permalink ? this.reference.permalink : null)) : null
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

@keyframes hand-movement {
  0% {
    transform: none;
  }
  100% {
    transform: translate(400%, 200%);
  }
}

.reference-preview {
  &.disabled {
    filter: grayscale(100%);
    opacity: 0.5;
  }
  > .preview {
    > .image {
      position: relative;
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
      background-color: $color-very-light-grey;
      background-size: cover;
      background-position: center center;
      @include shadow;
      > .pub-dest-logo {
        position: absolute;
        top: 0;
        left: 0;
        width: 24px;
        height: 24px;
        background-size: contain;
      }
    }
    &.container {
      width: 100%;
      display: flex;
      flex-direction: column;
      > .panel:last-child {
        margin-top: 0.75rem;
      }
      @include tcl-sm {
        flex-direction: row;
        align-items: flex-start;
        > .panel:first-child {
          width: 35%;
          margin-right: 1rem;
        }
        > .panel:last-child {
          width: 65%;
          margin-top: 0;
        }
      }
    }
  }
  > .preview.align-center {
    > .image {
      margin: 0 auto;
    }
    > .title {
      text-align: center;
    }
  }
  > .preview.forward {
    max-width: 20rem;
    margin: 0 auto;
    > .image {
      transform: skewY(-6.8deg);
    }
    > .title {
      margin-left: 50%;
    }
    > .hand-container {
      position: absolute;
      top: 2rem;
      left: 2rem;
      animation: 'hand-movement' 1s infinite;
    }
  }
  > .preview.horizontal {
    display: flex;
    align-items: flex-start;
    > .image {
      width: 35%;
      margin-right: 0.75rem;
    }
    > .summary {
      width: 65%;
    }
  }
}
</style>
