<template>
<div class="modal share">
  <div class="section-title with-underline text-align-center"><span>分享這一頁到</span></div>
  <div class="links">
    <a target="_blank" :href="twitterShare"><div class="button social" :style="twitter"></div></a>
    <a target="_blank" :href="facebookShare"><div class="button social" :style="facebook"></div></a>
    <!--<a><div class="button social" :style="line"></div></a>-->
  </div>
</div>
</template>

<script>
import facebook from 'watchout-common-assets/images/platforms/facebook.png'
// import line from 'watchout-common-assets/images/platforms/line.png'
import twitter from 'watchout-common-assets/images/platforms/twitter.png'

export default {
  props: ['data'],
  data() {
    return {
      facebook: {
        backgroundImage: `url(${facebook})`
      },
      // line: {
      //   backgroundImage: `url(${line})`
      // },
      twitter: {
        backgroundImage: `url(${twitter})`
      }
    }
  },
  computed: {
    facebookShare() {
      return `https://www.facebook.com/sharer/sharer.php?u=${this.data.url}`
    },
    twitterShare() {
      return `https://twitter.com/intent/tweet?url=${this.data.url}`
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.share {
  position: relative;
  width: 12rem;
  padding: 1rem;
  background-color: $color-watchout-light;
  @include shadow;
  > .section-title {
    margin-bottom: 0.5rem;
  }
  > .links {
    display: flex;
    justify-content: space-around;
  }
  .button.social {
    background-size: contain;
    width: 2rem;
    height: 2rem;
  }
}
</style>
