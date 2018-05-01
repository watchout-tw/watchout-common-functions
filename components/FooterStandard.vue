<template>
<footer class="standard">
  <div class="earth green"></div>
  <div class="earth soil-light"></div>
  <div class="earth soil-dark"></div>
  <div class="earth bedrock">
    <div class="social">
      <div v-for="group of cptSocialGroups" class="group d-flex flex-row justify-content-around">
        <a v-for="item of group.items" :href="item.link" class="link a-block" target="_blank" :key="item.link">
          <img class="image" :src="item.image" />
          <label class="text a-target">{{ item.text }}</label>
        </a>
      </div>
    </div>
    <div class="link-groups d-flex flex-row justify-content-center">
      <div v-for="group of linkGroups" class="group">
        <div class="title">
          <h5 class="font-weight-normal">{{ group.title }}</h5>
        </div>
        <div class="item" v-for="item of group.links" :key="item.url">
          <component :is="item.is" :to="item.to" :href="item.href" class="a-text">{{ item.title }}</component>
        </div>
      </div>
    </div>
  </div>
  <div class="elements">
    <no-ssr>
      <div class="grass d-flex align-items-end justify-content-between">
        <div v-for="i in patchCount" class="patch" :class="patchSize()" :style="patchStyles()" :key="i"></div>
      </div>
    </no-ssr>
    <img v-for="tree of trees" :src="getTreeImage(tree)" :class="getTreeClasses(tree)" :key="tree.name" />
  </div>
</footer>
</template>

<script>
import { env } from 'watchout-common-assets'

const getPlatformIcon = (platform) => require('watchout-common-assets/images/platforms/' + platform + '/black.png')

const social = [
  {
    platform: 'twitter',
    text: 'Twitter',
    image: getPlatformIcon('twitter'),
    link: 'https://twitter.com/watchoutTW'
  },
  {
    platform: 'line',
    text: 'LINE',
    image: getPlatformIcon('line'),
    link: 'https://line.me/R/ti/p/%40dsy7499i'
  },
  {
    platform: 'instagram',
    text: 'Instagram',
    image: getPlatformIcon('instagram'),
    link: 'https://www.instagram.com/watchout.tw/'
  },
  {
    platform: 'facebook',
    text: 'Facebook',
    image: getPlatformIcon('facebook'),
    link: 'https://facebook.com/watchout.tw/'
  }
]
const linkGroups = [
  {
    title: '沃草產品',
    links: [
      {
        title: '國會無雙',
        url: env.channels.musou.links.home
      },
      {
        title: '媒體實驗',
        url: env.channels['musou-media-experiment'].links.home
      },
      {
        title: '給問擂台',
        url: env.channels.ask.links.home
      },
      {
        title: '中央公園',
        url: env.channels.park.links.home
      },
      {
        title: '議題實驗室',
        url: env.channels.lab.links.home
      },
      {
        title: '公民學院',
        url: env.channels.edu.links.home
      }
    ]
  },
  {
    title: '關於沃草',
    links: [
      {
        title: 'English',
        url: 'overseas',
        relative: true
      },
      {
        title: '歷年影響力報告',
        url: 'impact',
        relative: true
      },
      {
        title: '透明報告',
        url: 'transparency/2014',
        relative: true
      },
      {
        title: '編輯獨立宣言',
        url: 'editorial-independence',
        relative: true
      },
      {
        title: '授權條款',
        url: 'license',
        relative: true
      },
      {
        title: '聯絡我們',
        url: 'contact',
        relative: true
      }
    ]
  }
]
const trees = [
  {
    type: 'tree',
    name: 'deliberate'
  },
  {
    type: 'tree',
    name: 'discover'
  },
  {
    type: 'tree',
    name: 'investigate'
  },
  {
    type: 'farmer',
    name: 'tangerine'
  },
  {
    type: 'farmer',
    name: 'green'
  },
  {
    type: 'farmer',
    name: 'brown'
  },
  {
    type: 'tree',
    name: 'sprout'
  }
]

export default {
  props: ['isAtHome'],
  data() {
    linkGroups.forEach(group => {
      group.links = group.links.map(link => {
        if(link.relative === true) {
          if(this.isAtHome === true) {
            link.is = 'nuxt-link'
            link.to = '/' + link.url
          } else {
            link.is = 'a'
            link.href = env.links.home + link.url
          }
        } else {
          link.is = 'a'
          link.href = link.url
        }
        return link
      })
    })
    return {
      social,
      linkGroups,
      trees
    }
  },
  methods: {
    patchSize() {
      return Math.random() > 0.5 ? 'large' : 'small'
    },
    patchStyles() {
      return {
        transform: 'translateX(' + (Math.round(Math.random()) * 2 - 1) * Math.round(Math.random() * 16) + 'rem)'
      }
    },
    getTreeImage(tree) {
      return require('watchout-common-assets/images/footer/' + tree.type + '/' + tree.name + '.gif')
    },
    getTreeClasses(tree) {
      return [tree.type, tree.type + '-' + tree.name]
    }
  },
  computed: {
    cptSocialGroups: function() {
      var arr = this.social
      var result = []
      var platforms = {}
      for (var i = 0; i < arr.length; i++) {
        var cur = arr[i]
        if (!(cur.platform in platforms)) {
          platforms[cur.platform] = {platform: cur.platform, items: []}
          result.push(platforms[cur.platform])
        }
        platforms[cur.platform].items.push(cur)
      }
      return result
    },
    patchCount() {
      return 4 + Math.round(Math.random() * 2)
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

// Footer
footer.standard {
  position: relative;
  display: block;
  width: 100%;
  margin-top: 8rem;
  z-index: $z-footer;
  > .earth {
    background-position: center;
    background-size: contain;
  }
  > .green {
    height: 14rem;
    background-image: url('~watchout-common-assets/images/footer/earth/green.png');
    background-repeat: repeat-x;
  }
  > .soil-light {
    height: 2rem;
    background-repeat: no-repeat;
    background-color: $color-soil-light;
    background-image: url('~watchout-common-assets/images/footer/earth/soil-light.png');
  }
  > .soil-dark {
    height: 2rem;
    background-repeat: no-repeat;
    background-color: $color-soil-dark;
    background-image: url('~watchout-common-assets/images/footer/earth/soil-dark.png');
  }
  > .bedrock {
    background-color: $color-bedrock;
    padding-bottom: 8rem;
    line-height: $line-height-tight;
    > .social {
      margin: 0 auto;
      padding: 4rem 0 0;
      max-width: 20rem;
      > .group {
        margin: 2rem;
        > .link {
          position: relative;
          text-align: center;
          &:after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-225%, -50%);
            width: 1.625rem;
            height: 1.625rem;
            background-size: contain;
          }
          > .image {
            display: block;
            margin: 0 auto 0.25rem;
            width: 2rem;
            background-color: white;
            @include shadow-darker;
          }
          > .text {
            color: $color-generic-grey;
          }
        }
      }
    }
    > .link-groups {
      > .group {
        margin: 0 1.5rem;
        text-align: left;
        > .title {
          margin: 0.25rem 0;
          color: $color-very-light-grey;
        }
        > .item {
          margin: 0.25rem 0;
          color: $color-generic-grey;
        }
      }
    }
  }
  > .elements {
    position: absolute;
    top: 0;
    width: 100%;
    height: 18rem;
    > .grass {
      position: absolute;
      bottom: 6rem;
      width: 100%;
      overflow: hidden;
      > .patch {
        background-size: contain;
        &.large {
          width: 1.75rem;
          height: 0.875rem;
          background-image: url('~watchout-common-assets/images/footer/grass/large.png');
        }
        &.small {
          width: 0.75rem;
          height: 0.5rem;
          background-image: url('~watchout-common-assets/images/footer/grass/small.png');
        }
      }
    }
    > .tree {
      position: absolute;
      &.tree-deliberate {
        bottom: 5.25rem;
        left: 10%;
        width: 11.25rem;
      }
      &.tree-discover {
        bottom: 5rem;
        left: 10%;
        transform: translateX(6rem);
        width: 8.5rem;
      }
      &.tree-investigate {
        display: none;
        @include bp-sm-up {
          display: block;
          bottom: 5.5rem;
          right: 10%;
          width: 11.875rem;
        }
      }
      &.tree-sprout {
        bottom: 4rem;
        left: 50%;
        transform: translateX(4rem);
        width: 1.25rem;
      }
    }
    > .farmer {
      position: absolute;
      &.farmer-tangerine {
        bottom: 1.5rem;
        left: 12%;
        width: 4.625rem;
      }
      &.farmer-green {
        bottom: -0.5rem;
        right: 8%;
        width: 5rem;
      }
      &.farmer-brown {
        bottom: 4.5rem;
        left: 10%;
        transform: translateX(14rem);
        width: 2rem;
      }
    }
  }
}
</style>
