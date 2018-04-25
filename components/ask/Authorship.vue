<template>
<div class="authorship">
  <component :is="hasLink ? 'a' : 'div'" :href="link" class="author a-block">
    <avatar :avatar="avatar" :classes="['shadow', 'inline', 'small']"/>
    <span class="name a-target">{{ name ? name : '作者尚未設定顯示名稱' }}</span>
  </component>
  <div class="date">{{ dateString }}</div>
</div>
</template>

<script>
import * as util from '../../lib/util'
import Avatar from '../Avatar'
export default {
  props: ['avatar', 'name', 'link', 'date'],
  computed: {
    hasLink() {
      return !!(this.link)
    },
    dateString() {
      return util.formatter.date(this.date)
    }
  },
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
  }
  > .date {
    font-size: 0.75rem;
  }
}
</style>
