<template>
<div class="nav-bar-menu">
  <div class="roots">
    <menu-single :menu="internalMenu" :activeIndex.sync="activeTreeIndex" />
  </div>
  <div class="children" v-if="activeTreeIndex > -1 && activeTreeIndex < internalMenu.length && internalMenu[activeTreeIndex].children">
    <div class="close black" @click.stop.prevent="activeTreeIndex = -1"></div>
    <menu-single :menu="internalMenu[activeTreeIndex].children" :classes="['vertical']" />
  </div>
  <div class="toggle-site-map" @click="addModal({ id: 'site-map', menu: internalMenu })">功能選單</div>
</div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import MenuSingle from 'watchout-common-functions/components/MenuSingle'
export default {
  mixins: [knowsWindowManagement],
  props: ['menu'],
  data() {
    return {
      activeTreeIndex: -1
    }
  },
  computed: {
    internalMenu() {
      return this.menu
    }
  },
  methods: {
  },
  components: {
    MenuSingle
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
.nav-bar-menu {
  padding: 0.25rem 0;
  font-size: 0.875rem;
  > .roots {
    display: none;
  }
  > .children {
    display: none;
    margin-top: 0.25rem;
    padding-right: 1.5rem; // close
    position: relative;
    background: $color-modal-overlay-white;
    z-index: $z-nav;
    @include shadow;
  }
  > .toggle-site-map {
    padding: 0.5em;
    line-height: 1;
    cursor: pointer;
  }
  @include tcl-sm {
    > .roots {
      display: block;
    }
    > .children {
      display: inline-block;
    }
    > .toggle-site-map {
      display: none;
    }
  }
}
</style>
