<template>
<div class="authorship">
  <div class="author">
    <avatar :avatar="avatar" :classes="['shadow', 'inline', 'small']"/>
    <span class="name">{{ name ? name : '作者尚未設定顯示名稱' }}</span>
  </div>
  <div class="date">{{ dateString }}</div>
</div>
</template>

<script>
import * as util from '../../lib/util'
import Avatar from '../Avatar'
export default {
  props: ['avatar', 'name', 'date'],
  computed: {
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
.authorship {
  > .author {
    margin: 0.25rem 0;
    display: flex;
    align-items: center;
    > .name {
      line-height: 1em;
      margin-left: 0.25rem;
    }
  }
  > .date {
    font-size: 0.75rem;
  }
}
</style>
