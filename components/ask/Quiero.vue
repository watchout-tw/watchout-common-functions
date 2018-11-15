<template>
<a class="quiero a-block" :class="internalClasses" @click="linkTo()">
  <div class="button" :class="internalClasses" :style="buttonStyles"></div>
  <span class="label a-target">{{ label }}</span>
</a>
</template>

<script>
import { knowsAuth, knowsWindowManagement } from 'watchout-common-functions/interfaces'

const defaultIconImage = 'highFive'

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
      return require(`watchout-common-assets/images/quiero/${this.icon ? this.icon : defaultIconImage}.png`)
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
a.quiero {
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
    line-height: $line-height-tight;
  }
  &.text-only {
    > .button {
      display: none;
    }
    > .label {
      margin-top: 0;
    }
  }
  &.disabled {
    cursor: default;
    > .label {
      color: $color-generic-grey;
    }
  }
}
</style>
