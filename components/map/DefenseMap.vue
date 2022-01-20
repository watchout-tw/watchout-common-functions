<template>
  <div>
    <div class="map-box" :class="[config.theme]">
      <div class="map-container">
        <div class="map content" id="map"></div>
      </div>
      <div class="active-features tcl-container">
        <div class="feature tcl-panel tcl-left-right-margin with-top-bottom-margin bg-very-very-light-grey">
          {{ markers.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'
import config from 'watchout-common-functions/config/config'

export default {
  mixins: [knowsWindowManagement],
  props: {
    shareURL: {
      type: String,
      default: null
    },
    markers: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      mapElementID: 'map'
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

      for(const marker of this.markers.features) {
        const el = document.createElement('div')
        const width = marker.iconSize[0]
        const height = marker.iconSize[1]
        el.className = 'marker'
        el.style.width = `${width}px`
        el.style.height = `${height}px`
        el.style.opacity = marker.opacity

        const prompt = {
          title: marker.question,
          description: marker.answer,
          references: marker.references,
          isNeedReferences: marker.references.length > 0
        }

        el.addEventListener('click', () => this.addModal({ id: 'message', prompt }))
        const mapBoxGL = require('mapbox-gl')
        new mapBoxGL.Marker(el)
          .setLngLat([marker.lng, marker.lat])
          .addTo(this.map)
      }
    }
  },
  components: {}
}
</script>

<style lang="scss">
@import 'watchout-common-functions/assets/mapbox.scss';

.title {
  font-weight: bolder;
  padding-bottom: 15px;
  font-size: 20px;
}

.marker {
  background-color: rgb(0, 0, 0);
  border-radius: 50%;
  cursor: pointer;
}

.referenceTitle {
  margin-top: 1rem;
  font-size: 12px;
}

.reference {
  margin-top: 0.5rem;
  font-size: 12px;
}

</style>
