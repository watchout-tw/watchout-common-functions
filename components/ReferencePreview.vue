<template>
  <div class="reference-preview" :class="{ disabled: !isActive }">
    <div class="preview text tcl-container" v-if="display === 'text'">
      <div class="tcl-panel">
        <component
          :is="titleTag"
          :class="titleClasses"
          v-html="spacingOptimizer(internalTitle)"
        />
      </div>
      <div class="tcl-panel" />
    </div>
    <div class="preview image" v-else-if="display === 'image'">
      <a
        :href="linkURL"
        class="image margin-bottom-8"
        :aspect-ratio="imageRatio"
        :style="imageStyles"
        :target="target"
      />
      <div v-if="isActive && showReadMore" class="more text-align-right">
        <a :href="linkURL" :class="readMoreClasses" :target="target">{{ readMoreText }}</a>
      </div>
    </div>
    <div
      class="preview forward"
      v-else-if="display === 'forward'"
      :class="previewClasses"
    >
      <a
        :href="linkURL"
        class="image"
        :aspect-ratio="imageRatio"
        :style="imageStyles"
        :target="target"
      >
        <div
          v-if="showPubDest"
          class="pub-dest-logo"
          :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"
        />
      </a>
      <component
        :is="titleTag"
        class="title margin-top-bottom-8"
        :class="titleClasses"
      >
        <a
          :href="linkURL"
          class="a-text text-color-musou"
          v-html="spacingOptimizer(internalTitle)"
          :target="target"
        />
      </component>
      <a :href="linkURL" class="hand-container" :target="target"><img class="hand" :src="hand" /></a>
    </div>
    <div
      class="preview vertical"
      v-else-if="display === 'vertical'"
      :class="previewClasses"
    >
      <a
        :href="linkURL"
        class="image"
        :aspect-ratio="imageRatio"
        :style="imageStyles"
        :target="target"
      >
        <div
          v-if="showPubDest"
          class="pub-dest-logo"
          :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"
        />
      </a>
      <div class="summary">
        <component
          :is="titleTag"
          class="title margin-top-bottom-8"
          :class="titleClasses"
        >
          <a
            :href="linkURL"
            class="a-text"
            v-html="spacingOptimizer(internalTitle)"
            :target="target"
          />
        </component>
        <div
          class="contributors margin-top-bottom-4 font-size-small secondary-text"
          v-if="showContributors !== false && contributors.length > 0"
        >
          <template v-for="(contributor, contributorIndex) of contributors">
            <avatar
              :persona="cachedAuthorPersona(contributor)"
              :show="['name']"
              :classes="['list-item', 'horizontal']"
              :link="false"
              :key="`contributor-${contributorIndex}`"
            />
            <span
              v-if="contributorIndex < contributors.length - 1"
              v-html="spacingOptimizer(PUNCT.PAUSE)"
              :key="`contributor-${contributorIndex}-separator`"
            />
          </template>
        </div>
        <div
          class="date font-size-tiny secondary-text margin-top-bottom-4"
          v-if="showPubAt && pubAt"
        >
          {{ getDateTimeString(pubAt) }}
        </div>
        <div class="description" v-if="internalDescription">
          {{ internalDescription }}
        </div>
        <div v-if="isActive && showReadMore" class="more margin-top-bottom-4">
          <a :href="linkURL" :class="readMoreClasses" :target="target">{{ readMoreText }}</a>
        </div>
      </div>
    </div>
    <div
      class="preview horizontal"
      v-else-if="display === 'horizontal'"
      :class="previewClasses"
    >
      <a
        :href="linkURL"
        class="image"
        :aspect-ratio="imageRatio"
        :style="imageStyles"
        :target="target"
      >
        <div
          v-if="showPubDest"
          class="pub-dest-logo"
          :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"
        />
      </a>
      <div class="summary">
        <component
          :is="titleTag"
          class="title margin-bottom-8"
          :class="titleClasses"
          ><a
            :href="linkURL"
            class="a-text"
            v-html="spacingOptimizer(internalTitle)"
            :target="target"
          />
        </component>
        <div
          class="contributors margin-top-bottom-4 font-size-small secondary-text"
          v-if="showContributors !== false && contributors.length > 0"
        >
          <template v-for="(contributor, contributorIndex) of contributors">
            <avatar
              :persona="cachedAuthorPersona(contributor)"
              :show="['name']"
              :classes="['list-item', 'horizontal']"
              :link="true"
              :key="`contributor-${contributorIndex}`"
            />
            <span
              v-if="contributorIndex < contributors.length - 1"
              v-html="spacingOptimizer(PUNCT.PAUSE)"
              :key="`contributor-${contributorIndex}-separator`"
            />
          </template>
        </div>
        <div
          class="date font-size-tiny secondary-text margin-top-bottom-4"
          v-if="showPubAt && pubAt"
        >
          {{ getDateTimeString(pubAt) }}
        </div>
        <div class="description" v-if="internalDescription">
          {{ internalDescription }}
        </div>
        <div v-if="isActive && showReadMore" class="more margin-top-bottom-4">
          <a :href="linkURL" :class="readMoreClasses" :target="target">{{ readMoreText }}</a>
        </div>
      </div>
    </div>
    <div class="preview default" :class="containerClasses" v-else>
      <!-- default is flexible -->
      <a
        :href="linkURL"
        class="image"
        :class="panelClasses"
        :aspect-ratio="imageRatio"
        :style="imageStyles"
        :target="target"
      >
        <!-- <div v-if="showPubDest" class="pub-dest-logo" :style="{ backgroundImage: 'url(' + pubDestLogo + ')' }"></div> -->
      </a>
      <div class="summary" :class="panelClasses">
        <component
          :is="titleTag"
          class="title margin-bottom-8"
          :class="titleClasses"
        >
          <a
            :href="linkURL"
            class="a-text"
            v-html="spacingOptimizer(internalTitle)"
            :target="target"
          />
        </component>
        <div
          class="contributors margin-top-bottom-4 font-size-small secondary-text"
          v-if="showContributors !== false && contributors.length > 0"
        >
          <template v-for="(contributor, contributorIndex) of contributors">
            <avatar
              :persona="cachedAuthorPersona(contributor)"
              :show="['name']"
              :classes="['list-item', 'horizontal']"
              :link="false"
              :key="`contributor-${contributorIndex}`"
            />
            <span
              v-if="contributorIndex < contributors.length - 1"
              v-html="spacingOptimizer(PUNCT.PAUSE)"
              :key="`contributor-${contributorIndex}-separator`"
            />
          </template>
        </div>
        <div
          class="date font-size-tiny secondary-text margin-top-bottom-4"
          v-if="showPubAt && pubAt"
        >
          {{ getDateTimeString(pubAt) }}
        </div>
        <div class="description" v-if="internalDescription">
          {{ internalDescription }}
        </div>
        <div v-if="isActive && showReadMore" class="more margin-top-bottom-4">
          <a :href="linkURL" :class="readMoreClasses" :target="target">{{ readMoreText }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PUNCT } from 'watchout-common-functions/lib/bunko'
import {
  WATCHOUT_REF_TYPES,
  parseReference
} from 'watchout-common-functions/lib/watchout'
import {
  knowsBunko,
  knowsFormatting,
  knowsWatchout
} from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'
import hand from 'watchout-common-assets/images/hand.svg'

export default {
  mixins: [knowsBunko, knowsFormatting, knowsWatchout],
  // TODO: remove showPubDest, since we're merging sites
  props: [
    'reference',
    'data',
    'display',
    'align',
    'imageRatio',
    'imageSize',
    'imageStyle',
    'image',
    'link',
    'title',
    'h',
    'titleClasses',
    'description',
    'contributorListStyle',
    'readMore',
    'readMoreStyle',
    'showPubDest',
    'status',
    'cachedAuthors',
    'target',
    'date'
  ],
  data() {
    return {
      PUNCT,
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
      return this.title ? this.title : this.doc ? this.doc.title : '標題未定'
    },
    internalDescription() {
      let desc = this.doc && this.doc.description ? this.doc.description : null
      if(this.description) {
        desc = this.description
      } else if(['', null].includes(this.description)) {
        desc = null
      }
      if(desc && desc.length > 100) {
        desc = desc.substring(0, 100) + '...'
      }
      return desc
    },
    containerClasses() {
      return this.display === 'tcl' ? ['tcl-container'] : ['container']
    },
    panelClasses() {
      return this.display === 'tcl'
        ? ['tcl-panel', 'tcl-left-right-margin', 'with-top-bottom-margin']
        : ['panel']
    },
    titleTag() {
      return `h${parseInt(this.h) ? parseInt(this.h) : 3}`
    },
    showContributors() {
      return this.contributorListStyle !== null
    },
    contributors() {
      let personas = []
      if(this.doc) {
        this.authorTypes.forEach(type => {
          let key = type.valuePlural
          if(this.doc[key]) {
            personas = personas.concat(this.doc[key])
          }
        })
        personas = [...new Set(personas)]
      }
      return personas
    },
    showPubAt() {
      if(this.reference) {
        return WATCHOUT_REF_TYPES.includes(this.reference.type)
      } else if(this.date) {
        // 額外設定 date 也顯示
        return true
      } else {
        return false
      }
    },
    pubAt() {
      return this.doc ? this.doc.publishedAt : (this.date ? this.date : null)
    },
    pubDestLogo() {
      return this.getSmallProjectLogo(
        this.doc && this.doc.publishedTo ? this.doc.publishedTo : 'external'
      )
    },
    showReadMore() {
      return this.readMoreStyle !== null
    },
    readMoreText() {
      return this.readMore ? this.readMore : '閱讀全文'
    },
    readMoreClasses() {
      let classes = []
      if(this.readMoreStyle === 'button') {
        classes.push(...['button', 'medium'])
      } else {
        classes.push(...['a-text', 'font-size-small', 'secondary-text'])
      }
      classes.push(
        this.showPubDest && this.doc && this.doc.publishedTo
          ? this.doc.publishedTo
          : 'watchout'
      )
      return classes
    },
    imageStyles() {
      let styles = {}
      let url = this.image ? this.image : null
      if(!url && this.doc && this.doc.image) {
        // try make ref from doc.image
        let docImageRef = parseReference(this.doc.image)
        url = docImageRef ? docImageRef.permalink : this.doc.image
      }
      styles.backgroundImage = `url(${url})`
      styles.maxWidth = this.imageSize ? this.imageSize : null
      return styles
    },
    previewClasses() {
      let classes =
        this.showPubDest && this.doc && this.doc.publishedTo
          ? [this.doc.publishedTo]
          : ['watchout']
      if(this.align === 'center') {
        classes.push('align-center')
      }
      return classes
    },
    isActive() {
      return this.status !== 'disabled'
    },
    linkURL() {
      // link (from props) 優先，否則使用 reference 的 permalink
      return this.isActive
        ? this.link
          ? this.link
          : this.reference && this.reference.permalink
            ? this.reference.permalink
            : null
        : null
    }
  },
  methods: {
    cachedAuthorPersona(personaID) {
      let author = this.cachedAuthors
        ? this.cachedAuthors.find(author => author.persona === personaID)
        : null
      return author ? author.personaObj : null
    }
  },
  components: {
    Avatar
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

      &[aspect-ratio='square'] {
        @include rect(1/1);
      }

      &[aspect-ratio='16:9'] {
        @include rect(16/9);
      }

      &[aspect-ratio='3:2'] {
        @include rect(3/2);
      }

      background-color: $color-very-light-grey;
      background-size: cover;
      background-position: center center;
    }

    > .summary {
      > .contributors {
        display: flex;
        flex-wrap: wrap;
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
