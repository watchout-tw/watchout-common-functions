<template>
<nav class="nav-bar">
  <nuxt-link class="nav-item logo-with-type" :to="{ name: 'index' }">
    <img :src="logo" :style="'height: 34px'" />
  </nuxt-link>
  <div class="nav-item menu-container">
    <nav-bar-menu :channel="channel" :menu="menu" :which-side="whichSide" v-if="menu" />
  </div>
  <div class="nav-item search-container"></div>
  <div class="nav-item avatar-container" @click="isCitizen ? addModal('swiss-knife') : addModal({ id: 'auth', joinOrLogin: 'login' })"><client-only>
    <avatar :show="['avatar']" :persona="activePersona" :parties="parties" />
  </client-only></div>
</nav>
</template>

<script>
// FIXME: perhaps better not use relative path
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import NavBarMenu from 'watchout-common-functions/components/NavBarMenu'
import Avatar from 'watchout-common-functions/components/Avatar'
import logo from 'watchout-common-assets/images/watchout-logo/white-reverse.png'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['channel', 'menu', 'parties'],
  data() {
    return {
      anon: { id: 'anon', type: 'system' },
      logo
    }
  },
  computed: {
    channelOrPageID() {
      return this.channel.pageID ? this.channel.pageID : this.channel.id
    },
    whichSide() {
      return this.channel.dark ? 'dark' : 'light'
    },
    navClasses() {
      return [
        this.channel.classes.backgroundColor.opaque
      ]
    }
  },
  created() {
    this.checkAuth()
  },
  components: {
    NavBarMenu,
    Avatar
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
nav.nav-bar {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 64px;
  margin: 0;
  padding: 0;
  z-index: $z-nav;
  background-color: $color-watchout-black;

  > .nav-item {
    flex-grow: 0;
    margin: auto 0 auto 1rem;
  }
  > .logo-with-type {
    flex-shrink: 0;
    display: block;
    width: 64px;
    overflow-x: hidden;
    @include bp-sm-up {
      width: auto;
    }
  }
  > .menu-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  > .avatar-container {
    display: flex;
    flex-basis: 60px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
  }
}
</style>
