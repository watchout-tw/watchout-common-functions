<template>
<div class="party-flag" :class="classes">
  <div class="stripes">
    <div class="stripe" v-for="stripe in stripes" :key="stripe.color" :style="{ height: stripe.height, backgroundColor: stripe.color }"></div>
  </div>
</div>
</template>

<script>
export default {
  props: ['id', 'code', 'options', 'parties'], // use party ID or code
  computed: {
    party() {
      return this.parties.filter(party => {
        let match = false
        if(this.id) {
          match = +party.id === +this.id
        } else if(this.code) {
          match = party.code === this.code
        }
        return match
      }).pop()
    },
    stripes() {
      let colors = this.party ? this.party.colors : ['#000']
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
    }
  }
}
</style>
