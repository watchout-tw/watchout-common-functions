<template>
<div class="video-player" :class="classes">
  <div class="player">
    <template v-if="platform === 'youtube'">
      <iframe class="content" width="100%" height="100%" :src="`https://www.youtube.com/embed/${id}?rel=0&amp;controls=0&amp;showinfo=0`" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </template>
  </div>
</div>
</template>

<script>
export default {
  props: ['platform', 'id', 'classes'],
  computed: {
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.video-player {
  > .player {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    background-color: $color-video-player-content-black;
    @include rect(16/9);
  }

  &.shadow-hard {
    > .player {
      box-shadow: 0 2px 16px 0 $color-video-player-shadow-black;
    }
  }
}
</style>
