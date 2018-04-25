<template>
<div class="welcome">{{ activePersona && activePersona.name ? '歡迎回來，' + activePersona.name : '歡迎來到沃草共有地' }}。</div>
</template>

<script>
import { knowsAuth } from 'watchout-common-functions/interfaces'
export default {
  mixins: [knowsAuth]
}
</script>

<style lang="scss">
.welcome {
  text-align: center;
}
</style>
