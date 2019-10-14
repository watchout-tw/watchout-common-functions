<template>
<div class="nav-bar-menu" :class="[whichSide]">
  <div class="roots">
    <menu-single :menu="internalMenu" :activeIndex.sync="activeTreeIndex" @itemClicked="rootSelected" />
  </div>
  <div class="children" v-if="activeTreeIndex > -1 && activeTreeIndex < internalMenu.length && internalMenu[activeTreeIndex].children" :style="childrenStyles">
    <div class="close black" @click.stop.prevent="activeTreeIndex = -1"></div>
    <menu-single :menu="internalMenu[activeTreeIndex].children" :classes="['vertical']" />
  </div>
  <div class="toggle-site-map" @click="addModal({ id: 'site-map', channel, menu: internalMenu })"></div>
</div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import MenuSingle from 'watchout-common-functions/components/MenuSingle'
export default {
  mixins: [knowsWindowManagement],
  props: ['channel', 'menu', 'whichSide'],
  data() {
    return {
      activeTreeIndex: -1,
      childrenStyles: {
        top: 0,
        left: 0
      }
    }
  },
  computed: {
    internalMenu() {
      return this.menu
    }
  },
  methods: {
    rootSelected(index, el) {
      let rect = el.getBoundingClientRect()
      this.childrenStyles.top = (rect.top + rect.height) + 'px'
      this.childrenStyles.left = rect.left + 'px'
    }
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
  font-size: 1rem;
  > .roots {
    display: none;
  }
  > .children {
    display: none;
    margin-top: 0.25rem;
    padding-right: 1.5rem; // close
    position: absolute;
    background: $color-modal-overlay-white;
    z-index: $z-nav;
    @include shadow;
  }
  > .toggle-site-map {
    width: 54px;
    height: $nav-height;
    margin: 0;
    padding: 0;
    background-size: contain;
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
  &.light {
    > .toggle-site-map {
      background-image: url('~watchout-common-assets/images/nav-button/menu/light.png');
    }
  }
  &.dark {
    > .toggle-site-map {
      background-image: url('~watchout-common-assets/images/nav-button/menu/dark.png');
    }
  }
}
</style>
