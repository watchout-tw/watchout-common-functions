<template>
<div class="identity">
  <div v-if="badge" class="badge"></div>
  <div v-if="label" class="label text-color-park">{{ label }}</div>
</div>
</template>

<script>
import { MAP as ID_MAP } from 'watchout-common-functions/lib/identities'

export default {
  props: ['persona'],
  computed: {
    hasIdentityTags() {
      return this.persona.data && Array.isArray(this.persona.data.identityTags)
    },
    hasIdentity() {
      return !this.isDefaultPersona || this.hasIdentityTags
    },
    badge() {
      return this.hasIdentity
    },
    label() {
      let label = this.hasIdentity && ID_MAP.hasOwnProperty(this.persona.type) ? ID_MAP[this.persona.type] : null
      if(this.hasIdentity && this.hasIdentityTags) {
        for(let tag of this.persona.data.identityTags) {
          if(ID_MAP.hasOwnProperty(tag)) {
            label = ID_MAP[tag]
          }
        }
      }
      return label
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.identity {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  > .badge {
    width: 1.5rem;
    height: 1.5rem;
    background-image: url('~watchout-common-assets/images/identity-badges/default.png');
    background-size: contain;
    border-radius: 50%;
  }
  > .label {
    margin: 0 0.25rem;
    font-size: $font-size-small;
  }
  &.small {
    > .badge {
      width: 1rem;
      height: 1rem;
    }
    > .label {
      margin: 0 0.125rem;
      font-size: $font-size-tiny;
    }
  }
}

</style>
