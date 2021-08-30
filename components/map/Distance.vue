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
import circle from '@turf/circle'
import length from '@turf/length'
import * as turfHelpers from '@turf/helpers'

function makeFeature(marker) {
  return {
    type: 'Feature',
    properties: marker,
    geometry: {
      type: 'Point',
      coordinates: [marker.lng, marker.lat]
    }
  }
}

// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
function makeCircle(marker, radius) {
  var center = [marker.lng, marker.lat]
  var options = {
    steps: 50,
    units: 'kilometers',
    properties: marker
  }
  return circle(center, radius, options)
}



export default {
  // mixins: [knowsMarkdown],
  props: {
    shareURL: {
      type: String,
      default: null
    },
    markers: {
      type: Array,
      default: () => []
    },
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
      address: '',
      featureCollectionSets: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const mapbox = require('mapbox-gl')
      mapbox.accessToken = config.mapboxAccessToken
      this.map = new mapbox.Map({
        container: this.mapElementID,
        style: 'mapbox://styles/watchout/cjozx93ng11m72rlqumr7uobd',
        center: this.config.center ? this.config.center : { lat: 25.0538962, lng: 121.5116391 },
        zoom: this.config.zoom ? this.config.zoom : 10
      })
      this.map.addControl(new mapbox.NavigationControl(), 'top-left')
      if(this.config.hasOwnProperty('disableScrollZoom') ? this.config.disableScrollZoom : true) {
        this.map.scrollZoom.disable()
      }
      this.config.ranges.forEach(range => {
        let features = this.markers.map(marker => {
          return makeCircle(marker, range.radius)
        })
        this.featureCollectionSets.push(features)
      })
    },
    fly() {
      const mapbox = require('mapbox-gl')
      googleMap.getGeocoding(this.address).then(response => {
        let userLoc = {
          lng: response.data.results[0].geometry.location.lng,
          lat: response.data.results[0].geometry.location.lat
        }
        const marker1 = new mapbox.Marker()
          .setLngLat([userLoc.lng, userLoc.lat])
          .addTo(this.map);
        let nearest = this.getNearest(userLoc)
        this.map.fitBounds([[userLoc.lng, userLoc.lat], [nearest.lng, nearest.lat]], {
          padding: 40
        })
        for(let i = 0; i < this.config.ranges.length; i++) {
          // pass parameter to anonymous function in setTimeout
          window.setTimeout(this.addLayer.bind(null, i), 1000 + i * 1000)
        }
      }).catch(error => {
        console.error(error)
      })
    },
    getNearest(location) {
      return this.markers.reduce(function(prev, current) {
        let linePrev = turfHelpers.lineString([[location.lng, location.lat], [prev.lng, prev.lat]])
        let lineCurrent = turfHelpers.lineString([[location.lng, location.lat], [current.lng, current.lat]])
        return (length(linePrev, { units: 'kilometers' }) < length(lineCurrent, { units: 'kilometers' }))
          ? prev : current
      })
    },
    addLayer(index) {
      this.map.addSource(this.config.ranges[index].name, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.featureCollectionSets[index]
        }
      })
      this.map.addLayer({
        id: this.config.ranges[index].name,
        type: 'fill',
        source: this.config.ranges[index].name,
        paint: {
          'fill-color': this.config.ranges[index].color,
          'fill-opacity': 0.4,
          'fill-outline-color': 'yellow'
        }
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