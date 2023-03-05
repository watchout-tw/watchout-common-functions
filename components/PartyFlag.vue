<template>
<div class="party-flag" :class="classes">
  <div class="stripes">
    <div class="stripe" v-for="stripe in stripes" :key="stripe.color" :style="{ height: stripe.height, backgroundColor: stripe.color }"><span>{{ party ? '' : '?' }}</span></div>
  </div>
</div>
</template>

<script>
export default {
  props: ['id', 'code', 'options', 'parties'], // use party ID or code
  computed: {
    party() {
      return Array.isArray(this.parties)
        ? this.parties.filter(party => {
          let match = false
          if(this.id) {
            match = +party.id === +this.id
          } else if(this.code) {
            match = party.code === this.code
          }
          return match
        }).pop()
        : null
    },
    stripes() {
      let colors = this.party ? this.party.colors : ['#ddd']
      return colors.map(color => ({
        height: 100 / colors.length + '%',
        color
      }))
    },
    classes() {
      return this.options ? this.options.split('&') : []
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.party-flag {
  width: 2rem;
  height: 1.75rem;
  &.small {
    width: 1.25rem;
    height: 1.09375rem;
  }

  > .stripes {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.75;
    > .stripe {
      width: 100%;
      display: block;
      border: none;
      background-color: black;
      transform: skew(0, -12.3391deg) scaleY(0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-weight: normal;
      color: $color-secondary-text-grey;
    }
  }
}
</style>
