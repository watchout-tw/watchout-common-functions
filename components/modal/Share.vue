<template>
<div class="modal share">
  <div class="section-title with-underline small text-align-center"><span>分享{{ what }}到</span></div>
  <share-to-platforms :url="data.url" />
</div>
</template>

<script>
import ShareToPlatforms from 'watchout-common-functions/components/ShareToPlatforms'

export default {
  props: ['data'],
  computed: {
    what() {
      return this.data && this.data.what ? this.data.what : ''
    }
  },
  components: {
    ShareToPlatforms
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.share {
  position: relative;
  width: 12rem;
  padding: 1rem;
  padding-bottom: 1.25rem;
  background-color: $color-watchout-light;
  @include shadow;

  > .section-title {
    margin-bottom: 0.5rem;
  }
}
</style>
