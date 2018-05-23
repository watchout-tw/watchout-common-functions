<template>
<div class="like-buttons">
  <div class="button-with-count" v-for="option in config.options" :key="option.value">
    <button class="input button simple round shadow-reduced" :class="state.me && state.me.hasOwnProperty(option.value) && state.me[option.value] === true ? option.activeClasses : option.inactiveClasses" :style="getOptionButtonStyles(option)" @click="doThis(option)">{{ option.showText ? option.value : '' }}</button>
    <span v-if="config.showCount" class="count font-size-smaller secondary-text"><slot :name="option.value + '-count'"></slot></span>
  </div>
</div>
</template>

<script>
import likeButtonImage from 'watchout-common-assets/images/buttons/like.png'
import dislikeButtonImage from 'watchout-common-assets/images/buttons/dislike.png'

const ICONS = {
  like: likeButtonImage,
  dislike: dislikeButtonImage
}

export default {
  props: ['config', 'state'],
  methods: {
    getOptionButtonStyles(option) {
      let styles = {}
      if(option.showText === false && ICONS.hasOwnProperty(option.value)) {
        styles.backgroundImage = 'url(' + ICONS[option.value] + ')'
      }
      return styles
    },
    doThis(option) {
      this.$emit(option.event, { value: option.value })
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.like-buttons {
  display: flex;
  justify-content: flex-end;
  > .button-with-count {
    display: flex;
    align-items: center;
    &:not(:last-child) {
      margin-right: 0.5rem;
    }
    > .button {
      background-size: contain;
      background-position: center center;
    }
    > .count {
      margin: 0 0.25rem;
      min-width: 0.5rem;
    }
  }
}
</style>
