<template>
<div class="ghost-card">
  <div class="content" v-if="type === 'html'" v-html="content.html"></div>
</div>
</template>

<script>
export default {
  props: ['card'],
  computed: {
    type() {
      return this.card[0]
    },
    content() {
      return this.card[1]
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.ghost-card {
  > .content {
    > .card.default {
      padding: 1rem;
      width: 16rem;
      line-height: $line-height-default;
      background-color: $color-watchout-light;
      @include shadow;
      > .title {
        font-size: 1rem;
        line-height: $line-height-default;
      }
    }
  }
}
</style>
