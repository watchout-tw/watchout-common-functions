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
    <div class="prompt-overlay" :class="[config.theme]" v-if="prompt.show">
      <div class="prompt with-dismiss" :class="['correct']">
        <div class="title" v-if="prompt.title">{{ prompt.title }}</div>
        <div class="message" v-if="prompt.description">{{ prompt.description }}</div>
        <div class="referenceTitle" v-if="prompt.isNeedReferences">參考資料</div>
        <div class="reference" v-for=" referenceData of prompt.references" :key="referenceData.text">
          <div class="referenceContent" v-if="referenceData.text">{{ referenceData.text }}</div>
          <a class="referenceLink a-text" v-if="referenceData.link" :href="referenceData.link"
             target="_blank"
          >
            {{ referenceData.link }}
          </a>
        </div>
        <div class="dismiss" @click="dismissPrompt"><span>OK</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import config from 'watchout-common-functions/config/config'

const defaultPrompt = {
  show: false,
  title: '',
  description: '',
  references: []
}

export default {
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
      mapElementID: 'map',
      prompt: defaultPrompt
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

        el.addEventListener('click', () => this.showPop(marker))
        const mapBoxGL = require('mapbox-gl')
        new mapBoxGL.Marker(el)
          .setLngLat([marker.lng, marker.lat])
          .addTo(this.map)
      }
    },
    showPop(marker) {
      this.prompt = {
        show: true,
        title: marker.question,
        description: marker.answer,
        references: marker.references,
        isNeedReferences: marker.references.length > 0
      }
    },
    dismissPrompt() {
      this.prompt = defaultPrompt
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
