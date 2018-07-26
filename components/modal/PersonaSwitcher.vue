<template>
<div class="modal persona-switcher">
  <div class="personas">
    <div class="persona" v-for="persona of personas" :key="persona.id" :class="persona.id === personaID ? ['active'] : []" @click="switchTo(persona.id)">
      <avatar :show="['avatar', 'name', 'identity']" :persona="persona" :classes="['vertical', 'shadow']" />
    </div>
  </div>
</div>
</template>

<script>
import * as core from 'watchout-common-functions/lib/core'
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  methods: {
    switchTo(nextPersonaID) {
      if(nextPersonaID !== this.personaID) {
        core.loginWithTokenWithPersonaID(this.getTokenCookie(), nextPersonaID)
      }
    }
  },
  components: {
    Avatar
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.persona-switcher {
  width: 18rem;
  background-color: $color-park-light;
  @include shadow;
  > .personas {
    display: flex;
    flex-wrap: wrap;
    align-items: top;
    justify-content: center;
    > .persona {
      width: 50%;
      padding: 0.5rem;
      cursor: pointer;
      &.active {
        background-color: rgba($color-park, 0.25);
      }
    }
  }
}
</style>
