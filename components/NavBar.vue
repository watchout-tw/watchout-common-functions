<template>
  <nav class="nav-bar" v-if="!isMobile">
    <nuxt-link class="nav-item logo-with-type" :to="{ name: 'index' }">
      <img :src="logo" :style="'height: 34px'" />
    </nuxt-link>
    <div class="nav-item menu-container">
      <nav-bar-menu
        :channel="channel"
        :menu="menu"
        :which-side="whichSide"
        v-if="menu"
      />
    </div>
    <div class="nav-item search-container"></div>
    <div
      class="nav-item avatar-container"
      @click="
        isCitizen
          ? addModal('swiss-knife')
          : addModal({ id: 'auth', joinOrLogin: 'login' })
      "
      v-show="initialMemberBlockShow"
    >
      <avatar :show="['avatar']" :persona="activePersona" :parties="parties" />
    </div>
  </nav>

  <nav class="nav-bar mobile" v-else>
    <nuxt-link class="nav-item logo-with-type" :to="{ name: 'index' }">
      <img :src="mobileLogo" :style="'height: 34px'" alt="logo" />
    </nuxt-link>
    <div class="nav-item menu-container">
      <div
        class="nav-icon"
        @click="addModal({ id: 'menu-and-auth', menu, isCitizen, initialMemberBlockShow })"
      >
        <Icon iconName="bars" iconSize="30px" />
      </div>
    </div>
  </nav>
</template>

<script>
// FIXME: perhaps better not use relative path
import {
  knowsAuth,
  knowsWatchout,
  knowsWindowManagement
} from 'watchout-common-functions/interfaces'
import NavBarMenu from 'watchout-common-functions/components/NavBarMenu'
import Avatar from 'watchout-common-functions/components/Avatar'
import Icon from 'watchout-common-functions/components/Icon.vue'
import logo from 'watchout-common-assets/images/watchout-logo/white-reverse.png'
import mobileLogo from 'watchout-common-assets/images/watchout-logo/white-chinese.png'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['channel', 'menu', 'parties', 'initialMemberBlockShow'],
  data() {
    return {
      anon: { id: 'anon', type: 'system' },
      logo,
      mobileLogo,
      isMobile: false
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
      return [this.channel.classes.backgroundColor.opaque]
    }
  },
  created() {
    this.checkAuth()
  },
  mounted() {
    this.isMobile = window.innerWidth <= 768
  },
  components: {
    NavBarMenu,
    Avatar,
    Icon
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

  &.mobile {
    justify-content: space-between;
  }

  > .nav-item {
    flex-grow: 0;
    margin: auto 0 auto 1rem;

    > .nav-icon {
      height: 100%;
      margin-right: 1rem;

      > .iconBlock {
        color: #ffffff;
        background-color: initial;
        position: relative;
        top: initial;
        right: initial;
        z-index: initial;
        border-radius: initial;
        font-size: 30px;
      }
    }
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
    justify-content: flex-end;

    .item {
      > a {
        color: #ffffff;
      }
    }
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
