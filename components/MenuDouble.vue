<template>
<ul class="menu double" :class="{ active: activeIndex > -1 }">
  <li class="tree" :class="{ active: activeIndex === index }" v-for="(item, index) of menu" :key="index">
    <div class="root item" @click="activeIndex = index">
      <a v-if="item.href" :href="item.href" :class="commonClasses" @click.native="itemClicked(index, $event)">{{ item.label.value }}</a>
      <nuxt-link v-else-if="item.route" :class="commonClasses" :to="item.route" @click.native="itemClicked(index, $event)">{{ item.label.value }}</nuxt-link>
      <a v-else class="root">{{ item.label.value }}</a>
    </div>
    <menu-single :class="['children']" :menu="item.children" v-if="index === activeIndex && item.children" @itemClicked="itemClicked(index, $event)" />
  </li>
</ul>
</template>

<script>
import MenuSingle from 'watchout-common-functions/components/MenuSingle'

let commonClasses = ['root', 'a-text', 'monochrome']

export default {
  props: ['menu'],
  data() {
    return {
      commonClasses,
      activeIndex: -1
    }
  },
  methods: {
    itemClicked(rootIndex, childIndex) {
      this.$emit('itemClicked')
    }
  },
  components: {
    MenuSingle
  }
}
</script>

<style lang="scss">
.menu.double {
  margin: 0;
  padding: 0;
  > .tree {
    margin: 0;
    padding: 0;
    > .root {
      padding: 0.5rem;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
    }
  }
  &.active {
    > .tree:not(.active) {
      opacity: 0.5;
    }
  }
}
</style>
