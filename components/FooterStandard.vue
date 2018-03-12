<template>
<footer class="standard">
  <div class="earth green"></div>
  <div class="earth soil-light"></div>
  <div class="earth soil-dark"></div>
  <div class="earth bedrock">
    <div class="social">
      <div v-for="group of cptSocialGroups" class="group d-flex flex-row justify-content-around" :class="group.platform">
        <a v-for="item of group.items" :href="item.link" class="link a-block" target="_blank" :key="item.link">
          <img class="image" :src="item.image" />
          <label class="text a-target">{{ item.text }}</label>
        </a>
      </div>
    </div>
    <div class="cluster d-flex flex-row justify-content-center">
      <div v-for="group of cluster" class="group">
        <div class="title">
          <h5 class="font-weight-normal">{{ group.title }}</h5>
        </div>
        <div class="item" v-for="item of group.links" :key="item.link">
          <a :href="item.link" class="a-text">{{ item.title }}</a>
        </div>
      </div>
    </div>
  </div>
  <div class="elements">
    <div class="grass d-flex align-items-end justify-content-between">
      <div v-for="i in patchCount()" class="patch" :class="patchSize()" :style="patchStyles(i)" :key="i"></div>
    </div>
    <img v-for="tree of trees" :src="getTreeImage(tree)" :class="getTreeClasses(tree)" :key="tree.name" />
  </div>
</footer>
</template>

<script>
import { env } from 'watchout-common-assets'

const social = [
  {
    platform: 'facebook',
    text: '追蹤我們的最新動態',
    image: 'https://graph.facebook.com/watchout.tw/picture?type=large',
    link: 'https://facebook.com/watchout.tw/'
  },
  {
    platform: 'LINE',
    text: '阿草好朋友',
    image: require('watchout-common-assets/images/footer/social/LINE/goodfriend.png'),
    link: 'https://store.line.me/stickershop/product/1024870/zh-Hant'
  },
  {
    platform: 'LINE',
    text: '阿草督督好',
    image: require('watchout-common-assets/images/footer/social/LINE/goodcitizen.png'),
    link: 'https://store.line.me/stickershop/product/1224270/zh-Hant'
  }
]
const cluster = [
  {
    title: '沃草產品',
    links: [
      {
        title: '國會無雙',
        link: env.channels.musou.links.home
      },
      {
        title: '給問擂台',
        link: env.channels.ask.links.home
      },
      {
        title: '議題實驗室',
        link: env.channels.lab.links.home
      },
      {
        title: '公民學院',
        link: env.channels.edu.links.home
      }
    ]
  },
  {
    title: '關於沃草',
    links: [
      {
        title: '歷年影響力報告',
        link: env.links.home + 'impact'
      },
      {
        title: '透明報告',
        link: env.links.home + 'transparency/2014'
      },
      {
        title: '授權條款',
        link: env.links.home + 'license'
      },
      {
        title: '聯絡我們',
        link: env.links.home + 'contact'
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
  data() {
    return {
      social: social,
      cluster: cluster,
      trees: trees
    }
  },
  methods: {
    patchCount: function() {
      return 4 + Math.round(Math.random() * 2)
    },
    patchSize: function() {
      return Math.random() > 0.5 ? 'large' : 'small'
    },
    patchStyles: function(i) {
      return {
        transform: 'translateX(' + (Math.round(Math.random()) * 2 - 1) * Math.round(Math.random() * 16) + 'rem)'
      }
    },
    getTreeImage: function(tree) {
      return require('watchout-common-assets/images/footer/' + tree.type + '/' + tree.name + '.gif')
    },
    getTreeClasses: function(tree) {
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
  z-index: $z-below-nav;
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
    line-height: 1.25;
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
            width: 5.625rem;
          }
          > .text {
            color: $color-generic-grey;
          }
        }
        &.facebook > .link:after {
          background-image: url('~watchout-common-assets/images/footer/social/facebook/round.png');
        }
        &.LINE > .link:after {
          background-image: url('~watchout-common-assets/images/footer/social/LINE/round.png');
        }
      }
    }
    > .cluster {
      > .group {
        margin: 0 1rem;
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
