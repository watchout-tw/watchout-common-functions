<template>
<div class="map-box distance" :class="[config.theme]">
  <div class="address controls form-field-many-inputs form-field-align-center margin-top-bottom-8">
    <text-editor placeholder="輸入你家地址" v-model="address" :classes="['park']" :simple="true" />
    <div class="input button park" @click="fly">確認</div>
  </div>
  <div class="map-container">
    <div class="map content" id="map"></div>
    <!-- <div class="datetime" v-if="currentDateTime">{{ $t(currentDateTime) }}</div> -->
  </div>
</div>
</template>

<script>
import config from 'watchout-common-functions/config/config'
import * as googleMap from 'watchout-common-functions/lib/google_map' 
import TextEditor from 'watchout-common-functions/components/TextEditor'

export default {
  // mixins: [knowsMarkdown],
  props: {
    shareURL: {
      type: String,
      default: null
    },
    // markers: {
    //   type: Array,
    //   default: () => []
    // },
    config: {
      type: Object,
      default: () => ({})
    }
    // id: {
    //   type: String,
    //   default: null
    // }
  },
  data() {
    return {
      mapElementID: 'map',
      address: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const mapbox = require('mapbox-gl')
      // const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
      mapbox.accessToken = config.mapboxAccessToken
      console.log(this.config)
      this.map = new mapbox.Map({
        container: this.mapElementID,
        style: 'mapbox://styles/watchout/cjozx93ng11m72rlqumr7uobd',
        center: this.config.center ? this.config.center : { lat: 25.0538962, lng: 121.5116391 },
        zoom: this.config.zoom ? this.config.zoom : 1
      })
      this.map.addControl(new mapbox.NavigationControl(), 'top-left')
      // this.map.addControl(new MapboxGeocoder({ accessToken: config.mapboxAccessToken }), 'top-left')
      if(this.config.hasOwnProperty('disableScrollZoom') ? this.config.disableScrollZoom : true) {
        this.map.scrollZoom.disable()
      }

      // https://www.mapbox.com/mapbox-gl-js/example/add-image/
      // https://www.mapbox.com/mapbox-gl-js/example/popup-on-click/
      // https://www.mapbox.com/mapbox-gl-js/example/cluster/
      // if(this.config.finale && this.config.finale.type === 'doc') {
      //   firestore.bunko.getProjectBySlug(`map/${this.id}`).then(response => {
      //     let lang
      //     if(this.$router.currentRoute.path.substring(0, 3).includes('en')) {
      //       lang = 'en'
      //     } else if(this.$router.currentRoute.path.substring(0, 3).includes('tb')) {
      //       lang = 'tb'
      //     } else {
      //       lang = 'zh'
      //     }
      //     return firestore.bunko.getDoc(response.config.finale[lang].id, true)
      //   }).then(response => {
      //     this.$set(this, 'doc', response)
      //   }).catch(error => {
      //     console.error(error)
      //   })
      // } else {
      //   this.map.on('load', this.drawStatic)
      //   this.setClusterEventHandler()
      // }
    },
    fly() {
      googleMap.getGeocoding(this.address).then(response => {
        console.log(response)
      }).catch(error => {
        console.error(error)
      })
    }
  },
  components: {
    TextEditor
  }
}
</script>

<style lang="scss">
@import 'watchout-common-functions/assets/mapbox.scss';

.map-box.distance {
  > .address.controls {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>