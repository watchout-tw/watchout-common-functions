<template>
<div class="menu single" :class="classes">
  <ul class="items">
    <li class="item" :class="{ active: index === activeIndex }" v-for="(item, index) of menu" :key="index">
      <a v-if="item.href" :href="item.href" :class="commonClasses" @click="activate($event, index)">{{ item.label.value }}</a>
      <nuxt-link v-else-if="item.route" :class="commonClasses" :to="item.route" @click.native="activate($event, index)">{{ item.label.value }}</nuxt-link>
      <a v-else-if="item.children" :class="[...commonClasses, 'has-children']" @click="activate($event, index)">{{ item.label.value }}</a>
      <div v-else class="item-text">{{ item.label.value }}</div>
    </li>
  </ul>
</div>
</template>

<script>
let commonClasses = ['item-text', 'a-text', 'monochrome']
export default {
  props: ['classes', 'menu', 'activeIndex'],
  data() {
    return {
      commonClasses
    }
  },
  methods: {
    activate(event, index) {
      this.$emit('update:activeIndex', index)
      // FIXME: sometimes event.path is undefined
      if(event.path) {
        let el = event.path.find(el => el.className.split(' ').includes('item'))
        this.$emit('itemClicked', index, el)
      }
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
      padding: 0.25rem 0.5rem;
      line-height: 1;
      cursor: pointer;
      &.active {
        > .a-text {
          @include underline(black, 1.0);
        }
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
