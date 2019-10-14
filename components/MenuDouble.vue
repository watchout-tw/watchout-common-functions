<template>
<ul class="menu double">
  <li class="tree" v-for="(item, index) of menu" :key="index">
    <div class="root item" @click="activeIndex = index">
      <a v-if="item.href" :href="item.href" class="root">{{ item.label.value }}</a>
      <nuxt-link v-else-if="item.route" class="root" :to="item.route">{{ item.label.value }}</nuxt-link>
      <div v-else class="root">{{ item.label.value }}</div>
    </div>
    <menu-single :class="['children']" :menu="item.children" v-if="index === activeIndex && item.children" @itemClicked="itemClicked(index, $event)" />
  </li>
</ul>
</template>

<script>
import MenuSingle from 'watchout-common-functions/components/MenuSingle'
export default {
  props: ['menu'],
  data() {
    return {
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
      line-height: 1;
      cursor: pointer;
    }
    > .children {
      margin: -0.25rem 0 0.5rem 1rem;
      font-size: 0.875em;
    }
  }
}
</style>
