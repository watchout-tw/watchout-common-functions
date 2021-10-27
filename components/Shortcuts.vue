<template>
<div class="shortcuts">
  <div class="banner-and-shortcuts tcl-container margin-top-bottom-8">
    <div class="banner-container tcl-panel with-top-bottom-margin">
      <a class="banner a-block" :href="banner.referenceObj.permalink" :style="{ backgroundImage: `url(${banner.imageObj.permalink})` }"></a>
    </div>
    <div class="shortcuts tcl-panel tcl-left-right-margin with-top-bottom-margin">
      <a class="shortcut a-block" v-for="(shortcut, index) of shortcuts" :href="shortcut.referenceObj.permalink" :style="{ backgroundImage: `url(${shortcut.imageObj.permalink})` }" :key="`shortcut-${index}`"></a>
    </div>
  </div>
</div>
</template>

<script>
import { parseReference } from 'watchout-common-functions/lib/watchout'
import { knowsWatchout } from 'watchout-common-functions/interfaces'

const baseURL = 'https://raw.githubusercontent.com/watchout-tw/watchout-common-assets/master/images/'

const data = {
  banner: {
    reference: 'project://anti-nuclear',
    image: 'projects/anti-nuclear-cover.gif'
  },
  shortcuts: [
    {
      reference: 'https://watchout.tw/impact',
      image: 'shortcuts/impact.png'
    },
    {
      reference: 'channel://musou',
      image: 'shortcuts/musou.png'
    },
    {
      reference: 'channel://uc',
      image: 'shortcuts/uc.png'
    },
    {
      reference: 'channel://ask',
      image: 'shortcuts/ask.png'
    },
    {
      reference: 'channel://lab',
      image: 'shortcuts/lab.png'
    },
    {
      reference: 'https://watchout.tw/news',
      image: 'shortcuts/news.png'
    }
  ]
}

export default {
  mixins: [knowsWatchout],
  data() {
    data.banner.referenceObj = parseReference(data.banner.reference)
    data.banner.imageObj = parseReference(baseURL + data.banner.image)

    for(let i = 0; i < data.shortcuts.length; i++) {
      let shortcut = data.shortcuts[i]
      shortcut.referenceObj = parseReference(shortcut.reference)
      shortcut.imageObj = parseReference(baseURL + shortcut.image)
    }
    return {
      banner: data.banner,
      shortcuts: data.shortcuts
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.shortcuts {
  > .banner-and-shortcuts {
    > .banner-container {
      > .banner {
        @include rect(2/1);
        background-size: cover;
        background-position: center center;
        @include shadow;
      }
    }
    > .shortcuts {
      display: flex;
      flex-wrap: wrap;
      margin: 0.125rem 0.625rem;
      > .shortcut {
        margin: 0.375rem;
        @include rect(5/3);
        max-width: 120px;
        background-size: cover;
        background-position: top left;
        @include shadow;
      }
    }
  }
}
</style>
