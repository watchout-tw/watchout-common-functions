<template>
<div class="modal transporter">
  <a class="channel a-block" :href="channel.link" v-for="channel of channels" :key="channel.id">
    <img class="logo" :src="channel.logo" />
    <div class="name font-size-small text-align-center"><span class="a-target">{{ channel.name }}</span></div>
  </a>
</div>
</template>

<script>
import { env } from 'watchout-common-assets'
import { knowsWatchout } from 'watchout-common-functions/interfaces' // FIXME: no relative paths

const channelIDs = ['park', 'musou', 'ask', 'lab', 'uc', 'watchout']
export default {
  mixins: [knowsWatchout],
  data() {
    return {
      channels: channelIDs.map(channelID => {
        let channel = env.channels[channelID]
        return {
          id: channelID,
          name: channel.name,
          link: channel.links.home,
          logo: this.getLargeProjectLogo(channelID)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.modal.transporter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  > .channel {
    margin: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    > .logo {
      width: 64px;
      margin: 0 auto;
      @include shadow;
    }
    > .name {
      margin: 0.5rem 0;
    }
  }
}
</style>
