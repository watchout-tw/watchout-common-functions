<template>
<div class="menu single" :class="classes">
  <ul class="items">
    <li class="item" :class="{ active: index === activeIndex }" v-for="(item, index) of menu" :key="index" @click="activate(index)">
      <component :is="item.route ? 'nuxt-link' : 'div'" class="a-text" :to="item.route">{{ item.label.value }}</component>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: ['classes', 'menu', 'activeIndex'],
  methods: {
    activate(index) {
      this.$emit('update:activeIndex', index)
      this.$emit('itemClicked', index)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.menu.single {
  > .items {
    margin: 0;
    padding: 0;
    > .item {
      margin: 0;
      padding: 0.5em;
      line-height: 1;
      cursor: pointer;
      &.active {
        background-color: $color-avatar-background-white;
      }
    }
  }
  &:not(.vertical) {
    > .items {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
