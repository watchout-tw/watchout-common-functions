<template>
<div class="authorship">
  <avatar size="small"
    :show="['avatar', 'name', 'identity']"
    :persona="persona"
    :link="true"
    :parties="parties"
    :classes="['horizontal', 'shadow', 'inline']"
    :secondaryText="score"
    :secondaryClasses="['score', 'bg-ask', 'font-size-small', 'text-color-white']"
  />
  <div class="date font-size-small">{{ getDateString(date) }}</div>
</div>
</template>

<script>
import { knowsFormatting } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'

export default {
  mixins: [knowsFormatting],
  props: ['persona', 'parties', 'score', 'date'],
  components: {
    Avatar
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.authorship {
  > .author {
    margin: 0.25rem 0;
    > .name {
      line-height: $line-height-tight;
      margin-top: 0.125rem;
      margin-left: 0.25rem;
    }
    > .score {
      margin: 0 0.25rem;
      padding: 0.125rem 0.25rem;
    }
  }
}
</style>
