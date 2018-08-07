<template>
<div class="modal transporter">
  <a class="channel" :href="channel.url" v-for="channel of channels">
    <img class="logo" :src="channel.logo" />
  </a>
</div>
</template>

<script>
import { env } from 'watchout-common-assets'
import { knowsWatchout } from '../../interfaces' // FIXME: no relative paths

const channelIDs = ['park', 'musou', 'ask', 'musou-media-experiment', 'lab', 'uc', 'watchout']
export default {
  mixins: [knowsWatchout],
  data() {
    return {
      channels: channelIDs.map(channelID => ({
        id: channelID,
        logo: this.getLargeProjectLogo(channelID),
        url: env.channels[channelID].links.home
      }))
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
    @include shadow;
    > .logo {
      width: 64px;
    }
  }
}
</style>
