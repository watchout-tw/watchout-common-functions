<template>
<div class="ad standard">
  <div class="content" v-if="data" :style="contentStyles"></div>
</div>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    contentStyles() {
      if(this.data.type === 'image') {
        let image = require('watchout-common-assets/images/ads/' + this.data.url)
        return {
          backgroundImage: 'url(' + image + ')'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.ad.standard {
  > .content {
    @include rect(4/1);
    background-size: contain;
    border-radius: 1px;
  }
}
</style>
