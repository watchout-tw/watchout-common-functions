<template>
  <nav class="nav-bar">
    <!--    pc block-->
    <nuxt-link class="nav-item logo-with-type pc" :to="{ name: 'index' }">
      <img :src="logo" :style="'height: 34px'" alt="logo" />
    </nuxt-link>
    <div class="nav-item menu-container pc">
      <nav-bar-menu
          :channel="channel"
          :menu="menu"
          :which-side="whichSide"
          v-if="menu"
      />
    </div>
    <div class="nav-item avatar-container pc"
         :style="{ flexBasis : !activePersona ? '60px' : '150px' }"
         @click="isCitizen? addModal({ id : 'swiss-knife', memberInfoEditable : memberInfoEditable }): addModal({ id: 'auth', joinOrLogin: 'login' })"
    >
      <div class="member-name" v-show="activePersona">
        Hi! {{ name }}
      </div>
      <avatar :show="['avatar']" :persona="activePersona" :parties="parties" />
    </div>

    <!--    mobile block-->

    <nuxt-link class="nav-item logo-with-type mobile" :to="{ name: 'index' }">
      <img :src="mobileLogo" :style="'height: 34px'" alt="logo" />
    </nuxt-link>

    <div class="nav-item menu-container mobile">
      <div
          class="nav-icon"
          @click="addModal({ id: 'menu-and-auth', menu, isCitizen, memberInfoEditable : memberInfoEditable })"
      >
        <Icon iconName="bars" />
      </div>
    </div>
  </nav>
</template>

<script>
// FIXME: perhaps better not use relative path
import { knowsAuth, knowsWatchout, knowsWindowManagement } from 'watchout-common-functions/interfaces'
import NavBarMenu from 'watchout-common-functions/components/NavBarMenu'
import Avatar from 'watchout-common-functions/components/Avatar'
import Icon from 'watchout-common-functions/components/Icon.vue'
import * as core from 'watchout-common-functions/lib/core'
import logo from 'watchout-common-assets/images/watchout-logo/white-reverse.png'
import mobileLogo from 'watchout-common-assets/images/watchout-logo/white-chinese.png'

const NAME_UNSET = '顯示名稱尚未設定'

export default {
  mixins: [knowsAuth, knowsWatchout, knowsWindowManagement],
  props: ['channel', 'menu', 'parties', 'memberInfoEditable'],
  data() {
    return {
      anon: { id: 'anon', type: 'system' },
      logo,
      mobileLogo,
      name: null
    }
  },
  beforeMount() {
    core.getCitizen().then(response => {
      if(response.data.name) {
        this.name = response.data.name
      } else {
        this.name = NAME_UNSET
      }
    }).catch(() => {
      this.name = NAME_UNSET
    })
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

  > .nav-item {
    flex-grow: 0;
    margin: auto 0 auto 1rem;

    &.pc {
      display: flex;
    }

    &.mobile {
      display: none;
    }

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
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;

    > .member-name {
      width: 100px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 0.5rem;
    }
  }
}

@media (max-width: 768px) {
  nav.nav-bar {
    > .nav-item {
      &.pc {
        display: none;
      }

      &.mobile {
        display: flex;
      }
    }
  }

}
</style>
