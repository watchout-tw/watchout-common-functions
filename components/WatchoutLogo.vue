<template>
<div class="watchout-logo">
  <img class="image" :src="image" :width="width" />
</div>
</template>

<script>
import logoBlack from 'watchout-common-assets/images/watchout-logo/black.png'
export default {
  data() {
    return {
      image: logoBlack,
      width: 194
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.watchout-logo {
  padding: 1rem;
  > .image {
    margin: 0 auto;
  }
}
</style>
