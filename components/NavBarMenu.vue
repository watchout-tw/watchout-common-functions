<template>
<div class="nav-bar-menu" :class="[whichSide]">
  <div class="roots">
    <ul class="items vertical">
      <li class="item" :class="{ active: index === activeTreeIndex }" v-for="(item, index) of internalMenu" :key="index">
        <a v-if="item.href" :href="item.href" :class="commonClasses" @click="activate(index)">{{ item.label.value }}</a>
        <nuxt-link v-else-if="item.route" :class="commonClasses" :to="item.route" @click.native="activate(index)">{{ item.label.value }}</nuxt-link>
        <div v-else-if="item.children" class="has-children">
          <a :class="[...commonClasses]" @click="activate(index)">{{ item.label.value }}</a>
          <div class="children" v-if="activeTreeIndex > -1 && activeTreeIndex < internalMenu.length && item.children && index === activeTreeIndex" :style="childrenStyles">
            <div class="close black" @click.stop.prevent="activeTreeIndex = -1"></div>
            <ul class="items">
              <li class="item" v-for="(childItem, childIndex) of item.children" :key="childIndex" @click.stop="activeTreeIndex = -1">
                <a v-if="childItem.href" :href="childItem.href" :class="commonClasses">{{ childItem.label.value }}</a>
                <nuxt-link v-else-if="childItem.route" :class="commonClasses" :to="childItem.route">{{ childItem.label.value }}</nuxt-link>
                <div v-else class="item-text">{{ item.label.value }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="item-text">{{ item.label.value }}</div>
      </li>
    </ul>
  </div>
  <div class="toggle-site-map" @click="addModal({ id: 'site-map', channel, menu: internalMenu })"></div>
</div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'

let commonClasses = ['item-text', 'a-text', 'monochrome']
export default {
  mixins: [knowsWindowManagement],
  props: ['channel', 'menu', 'whichSide'],
  data() {
    return {
      activeTreeIndex: -1,
      activeChildTreeIndex: -1,
      childrenStyles: {
        top: 0,
        left: 0
      },
      commonClasses
    }
  },
  computed: {
    internalMenu() {
      return this.menu
    }
  },
  methods: {
    activate(index) {
      this.activeTreeIndex = this.activeTreeIndex === index ? -1 : index
    }
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
        > .has-children {
          position: relative;
          > .children {
            margin-top: 1.8rem;
            padding-right: 1.5rem; // close
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            position: absolute;
            min-width: 120px;
            background: $color-modal-overlay-white;
            z-index: $z-nav;
            @include shadow;
            > .items {
              > .item {
                padding: 0.5rem 0;
              }
            }
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
