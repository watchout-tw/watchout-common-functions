<template>
<div class="identity">
  <div v-if="badge" class="badge"></div>
  <div v-if="duration || title" class="label text-color-park">
    <span v-if="duration" class="duration ">{{ duration }}</span>
    <span v-if="title" class="title">{{ title }}</span>
  </div>
</div>
</template>

<script>
import { mysqlTSToDateObj } from 'watchout-common-functions/lib/util'
import { MAP as ID_MAP } from 'watchout-common-functions/lib/identities'

export default {
  props: ['persona'],
  computed: {
    hasIdentityTags() {
      return this.persona.data && Array.isArray(this.persona.data.identityTags)
    },
    hasIdentity() {
      return !(this.persona && this.persona.type === 'default') || this.hasIdentityTags
    },
    badge() {
      return this.hasIdentity
    },
    duration() {
      let startDateString = this.persona && this.persona.start_date ? mysqlTSToDateObj(this.persona.start_date).getFullYear() : null
      let endDateString = this.persona && this.persona.end_date ? mysqlTSToDateObj(this.persona.end_date).getFullYear() : null
      return startDateString ? startDateString + (endDateString && endDateString !== startDateString ? '-' + endDateString : '') : null
    },
    title() {
      let title = this.hasIdentity && ID_MAP.hasOwnProperty(this.persona.type) ? ID_MAP[this.persona.type] : null
      if(this.hasIdentity && this.hasIdentityTags) {
        for(let tag of this.persona.data.identityTags) {
          if(ID_MAP.hasOwnProperty(tag)) {
            title = ID_MAP[tag]
          }
        }
      }
      return title
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
    margin-right: 0.25rem;
  }
  > .duration,
  > .label {
    font-size: $font-size-small;
    line-height: $line-height-tight;
  }
  > .label {
    margin: 0 0.25rem;
    > .duration {
      margin-right: 0.125rem;
      font-weight: normal;
    }
  }
  &.small {
    > .badge {
      width: 1rem;
      height: 1rem;
      margin-right: 0.125rem;
    }
    > .label {
      margin: 0 0.125rem;
      font-size: $font-size-tiny;
    }
  }
}

</style>
