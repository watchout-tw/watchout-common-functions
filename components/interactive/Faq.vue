<template>
  <div class="section faq dark" id="faq">
    <div v-if="hasTitle" class="section-header tcl-container">
      <div class="tcl-panel tcl-left-right-margin">
        <h3 class="title text-align-center" v-html="spacingOptimizer(faqTitle)"></h3>
        <div class="update text-align-center secondary-text font-size-small">{{ lastUpdateTime }}</div>
      </div>
    </div>
    <div class="items tcl-container">
      <div class="item tcl-panel with-top-bottom-margin" v-for="(item, itemIndex) of faq" :key="itemIndex">
        <h2 class="title" v-html="spacingOptimizer(item.question)" />
        <div class="description paragraphs a-text-parent"
             v-html="markdown(item.answer)"
             v-show="faqIX[itemIndex].show"
        />

        <div class="imageBox" v-if="faqIX[itemIndex].show">
          <img :src="item.imageLink" :alt="itemIndex">
        </div>

        <a class="toggle a-block font-size-small"
           v-if="!faqIX[itemIndex].show"
           @click="faqIX[itemIndex].show = !faqIX[itemIndex].show"
        >
          <span class="a-target">{{ showDetail }}</span>
        </a>
      </div>
      <div class="tcl-panel"></div>
    </div>
  </div>
</template>

<script>
import { knowsBunko, knowsMarkdown } from 'watchout-common-functions/interfaces'

const faqTitle = '快問快答'
const lastUpdateTitle = '最後更新：'
const showDetail = '⋯'

export default {
  mixins: [knowsBunko, knowsMarkdown],
  props: ['lastUpdate', 'faq', 'hasTitle'],
  data() {
    let faqIX = this.faq.map(item => {
      return {
        show: false
      }
    })
    return {
      faqIX
    }
  },
  computed: {
    faqTitle() {
      return faqTitle
    },
    lastUpdateTime() {
      return `${lastUpdateTitle}${this.lastUpdate}`
    },
    showDetail() {
      return showDetail
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

@mixin container-with-toggle {
  padding: 1rem 1rem 0 1rem;
  > .toggle {
    padding: 0.125rem 0 0.75rem 0;
  }
}

> .section.dark {
  padding: 1rem 0;
  background-color: $color-dark-grey;
  color: $color-very-very-light-grey;

  > .items {
    > .item {
      background-color: $color-nice-grey;
      @include container-with-toggle;
    }
  }
}

.imageBox {
  width: 100%;
  height: auto;
  margin-bottom: 1em;

  img {
    width: 100%;
    height: 100%
  }
}
</style>
