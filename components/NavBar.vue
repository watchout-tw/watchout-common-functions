<template>
<nav class="nav-bar" :class="navClasses">
  <div class="nav-item switcher" v-if="channel.switcher.show" :style="switcherStyles" @click="addModal('transporter')"></div>
  <nuxt-link class="nav-item logo-with-type" :to="{ name: 'index' }">
    <img :src="getProjectLogoWithType(channel.id)" :style="getProjectLogoWithTypeStyles(channel.id)"/>
  </nuxt-link>
  <div class="nav-item menu-container">
    <nav-bar-menu :menu="menu" v-if="menu"/>
  </div>
  <div class="nav-item search-container"></div>
  <div class="nav-item avatar-container" @click="isCitizen ? addModal('swiss-knife') : addModal({ id: 'auth', joinOrLogin: 'join' })"><no-ssr>
    <avatar :show="['avatar']" :persona="activePersona" :parties="parties" />
  </no-ssr></div>
</nav>
</template>

<script>
// FIXME: perhaps better not use relative path
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import NavBarMenu from 'watchout-common-functions/components/NavBarMenu'
import Avatar from 'watchout-common-functions/components/Avatar'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['channel', 'menu', 'parties'],
  data () {
    return {
      anon: { id: 'anon', type: 'system' }
    }
  },
  computed: {
    whichSide() {
      return this.channel.isDark ? 'dark' : 'light'
    },
    navClasses() {
      return [
        this.channel.classes.backgroundColor.opaque
      ]
    },
    switcherStyles() {
      return {
        backgroundImage: 'url(' + require('watchout-common-assets/images/nav-button/switcher/' + (this.channel.switcher.dark ? 'dark' : 'light') + (this.channel.switcher.iconOnly ? '-icon-only' : '') + '.png') + ')'
      }
    }
  },
  created () {
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

  > .nav-item {
    flex-grow: 0;
  }
  > .switcher {
    flex-shrink: 0;
    flex-basis: 52px;
    background-size: cover;
    background-position: center;
    cursor: pointer;
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
  }
  > .avatar-container {
    display: flex;
    flex-basis: 60px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
