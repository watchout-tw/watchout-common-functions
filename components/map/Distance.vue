<template>
<div class="map-box distance" :class="[config.theme]">
  <div class="address controls form-field-many-inputs form-field-align-center margin-top-bottom-8">
    <text-editor placeholder="輸入你家地址" v-model="address" :classes="['park']" :simple="true" />
    <div class="input button park" @click="fly">確認</div>
  </div>
  <div class="map-container">
    <div class="map content" id="map"></div>
  </div>
  <div class="consequence full-width-container yellow" v-if="endExplode">
    <div class="title">你家離最近的核電廠 {{ userSpot.distance }} 公里</div>
    <div class="description">於日本福島核災中，符合 <span class="action">{{ this.config.ranges[userSpot.nearestIndex].text }}</span> 的受災程度</div>
    <div class="suggestions">
      <div v-for="range of this.config.ranges" class="suggestion" :key="range.name">
        {{ range.name }}：{{ range.text }}
      </div>
    </div>
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

// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
function makeCircle(marker, range) {
  var center = [marker.lng, marker.lat]
  var options = {
    steps: 50,
    units: 'kilometers',
    properties: {
      ...range,
      ...marker
    }
  }
  return circle(center, range.radius, options)
}

export default {
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
      endExplode: false,
      mapElementID: 'map',
      address: '',
      featureCollectionSets: [],
      nearestSpot: {},
      distanceToStation: 0,
      userSpot: {}
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    shortestDistance() {
      let line = turfHelpers.lineString([[this.userSpot.lng, this.userSpot.lat], [this.nearestSpot.lng, this.nearestSpot.lat]])
      return +(Math.round(length(line, { units: 'kilometers' }) + 'e+2')  + 'e-2')
    }
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
          return makeCircle(marker, range)
        })
        this.featureCollectionSets.push(features)
      })
      let stationIconURL = 'https://static.tumblr.com/wpquu0m/VvFmjcm2i/burn-01.png'
      this.map.loadImage(stationIconURL, (err, image) => {
        if (err) throw err
        // Add the image to the map style.
        this.map.addImage('station', image)
        this.map.addSource('markers-station', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.featureCollectionSets[0]
          }
        })
        this.map.addLayer({
          id: 'markers-station',
          type: 'symbol',
          source: 'markers-station',
          layout: {
            'icon-allow-overlap': true,
            'icon-image': 'station', // reference the image
            'icon-size': 0.1
          }
        })
      })
    },
    fly() {
      const mapbox = require('mapbox-gl')
      googleMap.getGeocoding(this.address).then(response => {
        this.userSpot = {
          lng: response.data.results[0].geometry.location.lng,
          lat: response.data.results[0].geometry.location.lat
        }
        const marker1 = new mapbox.Marker()
          .setLngLat([this.userSpot.lng, this.userSpot.lat])
          .addTo(this.map);
        this.nearestSpot = this.getNearest(this.userSpot)
        let line = turfHelpers.lineString([[this.userSpot.lng, this.userSpot.lat], [this.nearestSpot.lng, this.nearestSpot.lat]])
        this.userSpot.distance =  +(Math.round(length(line, { units: 'kilometers' }) + 'e+2')  + 'e-2')
        this.map.fitBounds([[this.userSpot.lng, this.userSpot.lat], [this.nearestSpot.lng, this.nearestSpot.lat]], {
          padding: 40
        })
        this.addLayer(0)
        let locatedInRange = false
        for(let i = 0; i < this.config.ranges.length; i++) {
          // pass parameter to anonymous function in setTimeout
          if (i > 0) {
            window.setTimeout(this.updateLayer.bind(null, i), i * 1500)
          }
          if (this.userSpot.distance < this.config.ranges[i].radius && !locatedInRange) {
            locatedInRange = true
            this.userSpot.nearestIndex = i
          }
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
      this.map.addSource('markers-explode', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.featureCollectionSets[index]
        }
      })
      this.map.addLayer({
        id: 'markers-explode',
        type: 'fill',
        source: 'markers-explode',
        paint: {
          'fill-color': [
            'match', ['get', 'radius'],
            5,
            '#800000',
            20,
            '#c0392b',
            30,
            '#d35400',
            80,
            '#e67e22',
            100,
            '#f39c12',
            // 250 and others
            '#f1c40f'
          ],
          'fill-opacity': [
            'match', ['get', 'radius'],
            5, 0.6,
            20, 0.3,
            30, 0.1,
            80, 0.1,
            100, 0.1,
            // 250 and others
            0.1
          ]
        },
        layout: {
          'fill-sort-key': ['to-number', ['get', 'radius']]
        }
      })
    },
    updateLayer(index) {
      let newFeatures = []
      for(let i = 0; i <= index; i++) {
        newFeatures = newFeatures.concat(this.featureCollectionSets[i])
      }
      let newDS = {
        type: 'FeatureCollection',
        features: newFeatures
      }
      this.map.getSource('markers-explode').setData(newDS)
      if (this.config.ranges[index].radius > 50) {
        this.flyToCenter()
      }
      if (index === this.config.ranges.length - 1) {
        this.endExplode = true
      }
    },
    flyToCenter() {
      this.map.flyTo({
        center: this.config.center,
        zoom: this.config.zoom,
        speed: 1.2
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
  > .consequence {
    padding: 1rem 0;
    &.yellow {
      background-color: $color-park;
    }
    > .title {
      text-align: center;
      font-size: 2rem;
    }
    > .description {
      text-align: center;
      font-size: 1.5rem;
      > .action {
        font-size: 2rem;
        color: red;
      }
    }
    > .suggestions {
      > .suggestion {
        text-align: center;
      }
    }
  }
}
</style>