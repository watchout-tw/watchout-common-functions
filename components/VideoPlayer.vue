<template>
<div class="video-player" :class="classes">
  <div class="player">
    <template v-if="platform === 'youtube'">
      <iframe class="content" width="100%" height="100%" :src="`https://www.youtube.com/embed/${id}?rel=0&amp;controls=0&amp;showinfo=0`" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </template>
    <template v-else-if="filetype === 'mp4'">
      <video class="content" controls>
        <source :src="src" type="video/mp4">
      </video>
    </template>
  </div>
</div>
</template>

<script>
export default {
  props: ['platform', 'id', 'filetype', 'src', 'classes'],
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

  &.shadow {
    > .player {
      @include shadow-lifted;
    }
  }
  &.shadow-hard {
    > .player {
      @include shadow-lifted-darkest;
    }
  }
}
</style>
