<template>
<nuxt-link class="comp-tag a-block" :to="{ name: 'tags-slug', params: { slug: tag.slug } }">
  <span class="a-target">{{ tag.title }}</span>
</nuxt-link>
</template>

<script>
export default {
  props: ['tag']
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.comp-tag {
  font-size: 1rem;
  line-height: 1;
  padding: 0.375rem 0.875rem;
  border-radius: 2rem;
  margin: 0.25rem;
  background-color: rgba($color-watchout, 0.5);
}
</style>
