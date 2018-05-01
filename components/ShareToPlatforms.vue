<template>
<div class="share-to-platforms" :class="classes">
  <div class="buttons">
    <a class="button social twitter" target="_blank" :href="twitterShare" :style="twitterStyles"></a>
    <a class="button social line" target="_blank" :href="lineShare" :style="lineStyles"></a>
    <a class="button social facebook" target="_blank" :href="facebookShare" :style="facebookStyles"></a>
  </div>
</div>
</template>

<script>
import twitterIconBlack from 'watchout-common-assets/images/platforms/twitter/black.png'
import lineIconBlack from 'watchout-common-assets/images/platforms/line/black.png'
import facebookIconBlack from 'watchout-common-assets/images/platforms/facebook/black.png'
import twitterIconWhite from 'watchout-common-assets/images/platforms/twitter/white.png'
import lineIconWhite from 'watchout-common-assets/images/platforms/line/white.png'
import facebookIconWhite from 'watchout-common-assets/images/platforms/facebook/white.png'
import { getPlatformShareURLs } from 'watchout-common-functions/functions'

export default {
  props: ['classes', 'url'],
  computed: {
    useWhiteIcons() {
      return this.classes && this.classes.includes('cuboids')
    },
    twitterIcon() {
      return this.useWhiteIcons ? twitterIconWhite : twitterIconBlack
    },
    lineIcon() {
      return this.useWhiteIcons ? lineIconWhite : lineIconBlack
    },
    facebookIcon() {
      return this.useWhiteIcons ? facebookIconWhite : facebookIconBlack
    },
    twitterShare() {
      return getPlatformShareURLs(this.url).twitter
    },
    lineShare() {
      return getPlatformShareURLs(this.url).line
    },
    facebookShare() {
      return getPlatformShareURLs(this.url).facebook
    },
    twitterStyles() {
      return {
        backgroundImage: `url(${this.twitterIcon})`
      }
    },
    lineStyles() {
      return {
        backgroundImage: `url(${this.lineIcon})`
      }
    },
    facebookStyles() {
      return {
        backgroundImage: `url(${this.facebookIcon})`
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.share-to-platforms {
  > .buttons {
    display: flex;
    justify-content: center;
    > .button.social {
      position: relative;
      background-size: contain;
      flex-grow: 0;
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      margin: 0 0.5rem;
      padding: 0;
    }
  }

  &.cuboids {
    > .buttons > .button.social {
      width: 3rem;
      height: 3rem;
      margin: 0 1rem;
      background-color: white;
      box-shadow: none;

      $button-depth: 8px;
      &.twitter {
        background-color: $color-twitter-light;
        @include cuboid($button-depth, $color-twitter-darker, $color-twitter, true);
      }
      &.line {
        background-color: $color-line-light;
        @include cuboid($button-depth, $color-line-darker, $color-line, true);
      }
      &.facebook {
        background-color: $color-facebook-light;
        @include cuboid($button-depth, $color-facebook-darker, $color-facebook, true);
      }
    }
  }
}
</style>
