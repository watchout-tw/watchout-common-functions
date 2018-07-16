<template>
<avatar :avatar="isCitizen ? activePersona.avatar : anon" :classes="['shadow']" />
</template>

<script>
import { knowsAuth } from 'watchout-common-functions/interfaces'
import Avatar from 'watchout-common-functions/components/Avatar'
export default {
  mixins: [knowsAuth],
  components: {
    Avatar
  }
}
</script>
