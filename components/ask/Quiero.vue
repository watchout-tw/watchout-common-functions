<template>
<div class="quiero" :class="classes">
  <div class="to" @click="linkTo()">
    <div class="button" :style="buttonStyles"></div>
    <label class="label">{{ label }}</label>
  </div>
</div>
</template>

<script>
import { knowsAuth, knowsWindowManagement } from '../../interfaces'

export default {
  mixins: [knowsAuth, knowsWindowManagement],
  props: ['icon', 'label', 'classes', 'to', 'config'],
  computed: {
    iconImage() {
      return require(`watchout-common-assets/images/quiero/${this.icon}.png`)
    },
    buttonStyles() {
      return {
        backgroundImage: 'url(' + this.iconImage + ')'
      }
    }
  },
  methods: {
    linkTo() {
      if(this.config && this.config.enabled === false) {
        return
      }
      if(this.icon === 'share' && this.config && this.config.url) {
        this.addModal({ id: 'share', url: this.config.url })
        return
      }
      if(this.config && this.config.citizenshipRequired && !this.isCitizen) {
        this.addModal({ id: 'auth', joinOrLogin: 'login' })
      } else {
        this.$router.push(this.to)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
$circle-size: 4.25rem;
.quiero {
  > .to {
    display: block;
    > .button {
      height: $circle-size;
      width: $circle-size;
      border-radius: $circle-size;
      background-color: rgba($color-ask, 0.25);
      background-size: contain;
      @include shadow;
    }
    > .label {
      display: block;
      margin-top: 0.5rem;
      line-height: 1;
    }
  }
  &.important > .to > .button {
    background-color: $color-ask;
  }
}
</style>
