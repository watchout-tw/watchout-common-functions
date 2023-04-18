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
        Hi! {{ internalName }}
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
        <Icon iconName="bars" iconSize="lg" :classes="['color']" />
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
      citizenObj: null,
      logo,
      mobileLogo
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
    },
    internalName() {
      let name = null

      if(this.citizenObj) {
        if(this.citizenObj.nickname) {
          name = this.citizenObj.nickname
        } else if(!this.citizenObj.nickname && this.citizenObj.name) {
          name = this.citizenObj.name
        }
      }

      if([undefined, null, ''].includes(name)) {
        name = NAME_UNSET
      }
      return name
    }

  },
  created() {
    this.checkAuth()
  },
  methods: {
    getCitizen() {
      core.getCitizen().then(response => {
        this.citizenObj = response.data
      })
    }
  },
  watch: {
    activePersona(newActivePersona) {
      if(newActivePersona) {
        this.getCitizen()
      }
    }
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
  margin: 0;
  padding: 0;
  width: 100%;
  height: 64px;
  background-color: $color-watchout-black;
  z-index: $z-nav;
  flex-direction: row;

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
      margin-right: 1rem;
      height: 100%;

      > .iconBlock {
        position: relative;
        top: initial;
        right: initial;
        font-size: 30px;
        color: #ffffff;
        background-color: initial;
        border-radius: initial;
        z-index: initial;
      }
    }
  }

  > .logo-with-type {
    display: block;
    overflow-x: hidden;
    width: 64px;
    flex-shrink: 0;
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
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;

    > .member-name {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 0.5rem;
      width: 100px;
      color: #ffffff;
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

        .color {
          color: #ffffff;
        }
      }
    }
  }

}
</style>
