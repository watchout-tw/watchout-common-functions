<template>
<div class="quiero" :class="internalClasses">
  <div class="to" @click="linkTo()">
    <div class="button" :class="internalClasses" :style="buttonStyles"></div>
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
    isEnabled() {
      return !(this.config && this.config.enabled === false)
    },
    internalClasses() {
      let classes = [].concat(Array.isArray(this.classes) ? this.classes : [])
      if(Array.isArray(this.classes)) {
        if(this.classes.includes('important')) {
          classes.push('ask')
        }
      }
      if(!this.isEnabled) {
        classes.push('disabled')
      }
      return classes
    },
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
      if(!this.isEnabled) {
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
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    > .button {
      height: $circle-size;
      width: $circle-size;
      border-radius: 50%;
      background-size: contain;
    }
    > .label {
      display: block;
      position: relative;
      margin-top: 0.625rem;
      line-height: 1;
    }
  }
  &.disabled {
    > .to {
      cursor: default;
      > .label {
        color: $color-generic-grey;
      }
    }
  }
}
</style>
