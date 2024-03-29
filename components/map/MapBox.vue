<template>
<div class="map-box" :class="[config.theme]">
  <div class="map-container">
    <div class="map content" id="map"></div>
    <div class="datetime" v-if="currentDateTime">{{ $t(currentDateTime) }}</div>
  </div>
  <div v-if="config.mode === 'play'" class="controls form-field-many-inputs form-field-align-center margin-top-bottom-8">
    <div class="input button large musou" @click="play" v-if="!isPlaying">{{ playButton }}</div>
    <div class="input button large musou" @click="pause" v-else>暫停</div>
    <div class="input button" @click="quitPlay" v-if="isPlaying || nextToPlay > 0">結束播放</div>
  </div>
  <div v-if="config.mode === 'fly'" class="controls form-field-many-inputs form-field-align-center margin-top-bottom-8">
    <div class="input button" @click="flyBack" v-if="isPlaying && nextToPlay > 1">{{ $t(prevStepButton) }}</div>
    <div class="input button large musou" @click="fly">{{ $t(nextStepButton) }}</div>
  </div>
  <div class="note font-size-tiny margin-top-4" v-if="config.mode === 'play' && hasNotStarted">
    <div class="text-align-center" v-if="config.mode === 'play'">點擊「播放」自動播放各地新聞</div>
    <div class="d-flex align-items-center justify-content-center"><span>點擊地圖上的圖示</span><span style="display: inline-block; margin: 0 0.125rem; font-size: 1.5rem; line-height: 1;">④</span><span>看當地新聞</span></div>
  </div>
  <div class="active-features tcl-container" v-if="activeFeatures.length > 0">
    <a v-for="(feature, index) of activeFeatures" class="feature a-block tcl-panel tcl-left-right-margin with-top-bottom-margin bg-very-very-light-grey" :href="feature.properties.link" target="_blank" :style="getFeatureStyles(feature)" :key="`active-feature-${index}`">
      <div class="primary-secondary-fields" v-if="feature.properties[config.feature.primaryField]"><label>{{ $t(feature.properties[config.feature.primaryField]) }}</label>&nbsp;<label>{{ config.feature.secondaryFields ? config.feature.secondaryFields.map(key => feature.properties[key]).join('') : '' }}</label></div>
      <div class="title" v-if="feature.properties.title">{{ $t(feature.properties.title) }}</div>
      <div class="image-container margin-top-bottom-4" v-if="feature.properties.image">
        <img class="image" v-show="imageIsLoaded" @load="imageIsLoaded = true" :src="feature.properties.image">
      </div>
      <div class="image-caption secondary-text font-size-tiny" v-if="feature.properties.image_caption">{{ $t(feature.properties.image_caption) }}</div>
      <div class="image-license secondary-text font-size-tiny" v-if="feature.properties.image_license">{{ $t(feature.properties.image_license) }}</div>
      <audio controls class="audio" v-if="feature.properties.audio"><source :src="feature.properties.audio" type="audio/mp3">你的瀏覽器無法播放聲音檔</audio>
      <div class="title-tw" v-if="feature.properties.title_tw">{{ feature.properties.title_tw }}</div>
      <div class="description paragraphs secondary-text font-size-small margin-top-bottom-8" v-html="markdown($t(feature.properties.description))"></div>
      <label class="more" v-if="feature.properties.link">閱讀更多</label>
    </a>
    <div class="tcl-panel"></div>
    <div class="tcl-panel"></div>
    <div class="tcl-panel"></div>
  </div>
  <div class="prompt-overlay" :class="[config.theme]" v-if="prompt.show">
    <div class="prompt with-dismiss" :class="config.prompt.classes">
      <img class="image" v-if="prompt.image" :src="prompt.image">
      <div class="primary-secondary-fields font-weight-bold">{{ prompt.primaryField }}&nbsp;{{ prompt.secondaryFields }}</div>
      <div class="message">{{ prompt.description }}</div>
      <div class="dismiss" @click="dismissPrompt"><span>OK</span></div>
    </div>
  </div>
  <div class="prompt-overlay" :class="[config.theme]" v-if="config.finale && config.finale.type !== 'doc' && finale.show">
    <div v-if="config.finale.type === 'doc'" class="prompt with-dismiss">
      <ghost-article :article="doc.content" />
      <div class="dismiss" @click="finale.show = false"><span>OK</span></div>
    </div>
    <div v-else class="prompt with-dismiss" :class="config.finale.classes">
      <div class="message paragraphs no-margin" :class="config.finale.messageClasses" v-html="markdown(config.finale.message)"></div>
      <div class="share margin-top-bottom-single">
        <share-to-platforms :url="shareURL" />
      </div>
      <div class="dismiss" @click="finale.show = false"><span>OK</span></div>
    </div>
  </div>
  <popup-article v-if="config.finale && config.finale.type === 'doc'" v-show="finale.show" :show.sync="finale.show" :doc="doc" :shareURL="shareURL" />
</div>
</template>

<script>
import * as firestore from 'watchout-common-functions/lib/firestore'
import { knowsMarkdown } from 'watchout-common-functions/interfaces'
import config from 'watchout-common-functions/config/config'
import ShareToPlatforms from 'watchout-common-functions/components/ShareToPlatforms'
import GhostArticle from 'watchout-common-functions/components/ghost/Article'
import PopupArticle from './PopupArticle'

const SRC_STATIC = 'markers'
const SRC_LIVE = 'markers-live'
const SRC_FLY = 'markers-fly'
const SOURCES = [SRC_STATIC, SRC_LIVE, SRC_FLY]

const LAYER_CL = 'clusters'
const LAYER_CL_COUNT = 'cluster-count'
const LAYER_MARKERS = 'markers-not-in-cluster'
const LAYER_LIVE = 'markers-live'
const LAYER_FLY = 'markers-fly'
const LAYERS = [LAYER_CL, LAYER_CL_COUNT, LAYER_MARKERS, LAYER_LIVE, LAYER_FLY]

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

const defaultPrevStepButton = '上一步'
const defaultNextStepButton = '下一步'

export default {
  mixins: [knowsMarkdown],
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
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      map: null,
      mapElementID: 'map',
      activeClusterID: null,
      activeFeatures: [],
      staticDS: null,
      liveDS: null,
      playbackInterval: 150,
      isPlaying: false,
      nextToPlay: -1,
      timer: null,
      prompt: {
        show: false,
        primaryField: null,
        secondaryFields: null,
        description: null
      },
      finale: {
        show: false
      },
      doc: null,
      imageIsLoaded: false
    }
  },
  computed: {
    eventQueue() {
      let queue = []
      for(let i = 0; i < this.markers.length; i++) {
        let marker = this.markers[i]
        queue.push({
          type: 'marker',
          markerIndex: i
        })
        if(marker.display_type === 'imminent_danger') {
          queue.push({
            type: 'prompt',
            markerIndex: i
          })
        }
      }
      if(this.config.finale) {
        queue.push({
          type: 'finale'
        })
      }
      return queue
    },
    hasNotStarted() {
      return this.nextToPlay < 0
    },
    nextEvent() {
      return this.nextToPlay >= 0 && this.nextToPlay < this.eventQueue.length ? this.eventQueue[this.nextToPlay] : null
    },
    nextEventMarker() {
      return this.nextEvent ? this.markers[this.nextEvent.markerIndex] : null
    },
    prevEvent() {
      return this.nextToPlay > 0 && this.nextToPlay <= this.eventQueue.length ? this.eventQueue[this.nextToPlay - 1] : null
    },
    prevEventMarker() {
      return this.prevEvent ? this.markers[this.prevEvent.markerIndex] : null
    },
    currentDateTime() {
      return this.nextEvent && this.nextEvent.markerIndex ? this.markers[this.nextEvent.markerIndex - 1].date : this.markers[this.markers.length - 1].date
    },
    playButton() {
      return this.nextEvent ? '繼續播放' : (this.hasNotStarted ? '播放' : '再次播放')
    },
    prevStepButton() {
      let text = defaultPrevStepButton
      if(Array.isArray(this.activeFeatures) && this.activeFeatures.length > 0 && this.activeFeatures[0].properties.prev_step_button) {
        text = this.activeFeatures[0].properties.prev_step_button
      }
      return text
    },
    nextStepButton() {
      let text = defaultNextStepButton
      if(this.nextEvent) {
        if(Array.isArray(this.activeFeatures) && this.activeFeatures.length > 0 && this.activeFeatures[0].properties.next_step_button) {
          text = this.activeFeatures[0].properties.next_step_button
        }
      } else if(this.hasNotStarted) {
        text = this.config.start ? this.config.start : '開始'
      } else {
        text = this.config.restart ? this.config.restart : '從頭開始'
      }
      return text
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    clear() {
      LAYERS.forEach(layerName => {
        if(this.map.getLayer(layerName)) {
          this.map.removeLayer(layerName)
        }
      })
      SOURCES.forEach(sourceName => {
        if(this.map.getSource(sourceName)) {
          this.map.removeSource(sourceName)
        }
      })
      this.activeClusterID = null
      this.activeFeatures = []
      this.isPlaying = false
      this.nextToPlay = -1
      this.clearTimer()
    },
    init() {
      const mapbox = require('mapbox-gl')
      // const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
      mapbox.accessToken = config.mapboxAccessToken

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
      if(this.config.finale && this.config.finale.type === 'doc') {
        firestore.bunko.getProjectBySlug(`map/${this.id}`).then(response => {
          let lang
          if(this.$router.currentRoute.path.substring(0, 3).includes('en')) {
            lang = 'en'
          } else if(this.$router.currentRoute.path.substring(0, 3).includes('tb')) {
            lang = 'tb'
          } else {
            lang = 'zh'
          }
          return firestore.bunko.getDoc(response.config.finale[lang].id, true)
        }).then(response => {
          this.$set(this, 'doc', response)
        }).catch(error => {
          console.error(error)
        })
      } else {
        this.map.on('load', this.drawStatic)
        this.setClusterEventHandler()
      }
    },
    drawStatic() {
      if(!this.map.getSource(SRC_STATIC)) {
        this.staticDS = {
          type: 'FeatureCollection',
          features: this.markers.map(makeFeature)
        }
        this.map.addSource(SRC_STATIC, {
          type: 'geojson',
          data: this.staticDS,
          cluster: this.config.hasOwnProperty('isCluster') ? this.config.isCluster : true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        })
      }
      this.map.addLayer({
        id: LAYER_CL,
        type: 'circle',
        source: SRC_STATIC,
        filter: ['has', 'point_count'],
        paint: this.config.clusterLayerPaint
      })
      this.map.addLayer({
        id: LAYER_CL_COUNT,
        type: 'symbol',
        source: SRC_STATIC,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium'],
          'text-size': 20
        },
        paint: this.config.clusterCountLayerPaint
      })
      this.map.addLayer({
        id: LAYER_MARKERS,
        type: 'circle',
        source: SRC_STATIC,
        filter: ['!', ['has', 'point_count']],
        paint: this.config.markerLayerPaint
      })
    },
    setClusterEventHandler() {
      this.map.on('click', 'clusters', e => {
        let cluster = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0]
        let clusterCoordinates = cluster.geometry.coordinates

        // https://stackoverflow.com/a/52344700
        // https://www.mapbox.com/mapbox-gl-js/api/#geojsonsource#getclusterleaves
        let clusterID = cluster.properties.cluster_id
        let markerCount = cluster.properties.point_count
        let source = this.map.getSource(SRC_STATIC)
        source.getClusterLeaves(clusterID, markerCount, 0, (error, markers) => {
          if(error) {
            console.error(error)
          }
          this.activeFeatures = markers
          this.map.flyTo({
            center: clusterCoordinates,
            zoom: this.map.getZoom() + 1
          })
        })
      })
      this.map.on('click', 'markers-not-in-cluster', e => {
        let marker = e.features[0]
        let coordinates = marker.geometry.coordinates.slice()
        this.activeFeatures = [marker]
        this.map.flyTo({
          center: coordinates,
          zoom: this.map.getZoom() + 1
        })
      })
    },
    clearTimer() {
      if(this.timer) {
        window.clearTimeout(this.timer)
      }
      this.timer = null
    },
    preparePlay() {
      this.clear()
      if(!this.map.getSource(SRC_LIVE)) {
        this.liveDS = {
          type: 'FeatureCollection',
          features: []
        }
        this.map.addSource(SRC_LIVE, {
          type: 'geojson',
          data: this.liveDS
        })
      }
      this.map.addLayer({
        id: LAYER_LIVE,
        type: 'circle',
        source: SRC_LIVE,
        paint: this.config.liveLayerPaint
      })
      this.isPlaying = false
      this.nextToPlay = 0
      this.clearTimer()
    },
    play() {
      if(this.hasNotStarted || this.nextToPlay >= this.eventQueue.length) {
        this.preparePlay()
      }
      if(this.nextEvent.type === 'marker') {
        // show marker
        this.isPlaying = true
        let nextFeature = makeFeature(this.nextEventMarker)
        this.liveDS.features.push(nextFeature)
        this.map.getSource(SRC_LIVE).setData(this.liveDS)
        this.activeFeatures.unshift(nextFeature)

        // done
        this.nextToPlay += 1
        if(this.nextEvent) {
          this.timer = window.setTimeout(this.play, this.playbackInterval)
        } else {
          this.isPlaying = false
        }
      } else if(this.nextEvent.type === 'prompt') {
        // show prompt
        this.isPlaying = false
        this.prompt.primaryField = this.nextEventMarker[this.config.feature.primaryField]
        this.prompt.secondaryFields = this.config.feature.secondaryFields.map(key => this.nextEventMarker[key]).join('')
        this.prompt.description = this.nextEventMarker.description
        this.prompt.show = true

        // done
        this.nextToPlay += 1
      } else if(this.nextEvent.type === 'finale') {
        // show finale
        this.isPlaying = false
        this.finale.show = true
        // done
        this.nextToPlay += 1
      }
    },
    prepareFly() {
      this.clear()
      if(!this.map.getSource(SRC_FLY)) {
        this.liveDS = {
          type: 'FeatureCollection',
          features: []
        }
        this.map.addSource(SRC_FLY, {
          type: 'geojson',
          data: this.liveDS
        })
      }
      this.map.addLayer({
        id: LAYER_FLY,
        type: 'circle',
        source: SRC_FLY,
        paint: this.config.flyLayerPaint
      })
      this.isPlaying = false
      this.nextToPlay = 0
    },
    fly() {
      if(this.hasNotStarted || this.nextToPlay >= this.eventQueue.length) {
        this.prepareFly()
      }
      if(this.nextEvent.type === 'marker') {
        this.isPlaying = true
        this.imageIsLoaded = false

        let nextFeature = makeFeature(this.nextEventMarker)
        if(this.liveDS.features.length > 0) {
          delete this.liveDS.features[this.liveDS.features.length - 1].properties.isLatest
        }
        nextFeature.properties.isLatest = 'latest'
        this.liveDS.features.push(nextFeature)
        this.map.getSource(SRC_FLY).setData(this.liveDS)
        this.map.flyTo({
          center: [this.nextEventMarker.lng, this.nextEventMarker.lat],
          zoom: this.nextEventMarker.zoom ? this.nextEventMarker.zoom : 15,
          speed: 1.2
        })
        this.activeFeatures.unshift(nextFeature)
      } else if(this.nextEvent.type === 'prompt') {
        this.isPlaying = false
        this.imageIsLoaded = true

        // show prompt
        this.prompt.primaryField = this.nextEventMarker[this.config.feature.primaryField]
        this.prompt.secondaryFields = this.config.feature.secondaryFields.map(key => this.nextEventMarker[key]).join('')
        this.prompt.description = this.nextEventMarker.description
        this.prompt.image = this.nextEventMarker.image
        this.prompt.show = true
      } else if(this.nextEvent.type === 'finale') {
        this.isPlaying = false
        this.imageIsLoaded = true

        // show finale
        this.finale.show = true
      }
      this.nextToPlay += 1
    },
    flyBack() {
      this.nextToPlay -= 1
      if(this.prevEvent.type === 'marker') {
        this.liveDS.features.splice(this.liveDS.features.length - 1, 1)
        if(this.liveDS.features.length > 0) {
          this.liveDS.features[this.liveDS.features.length - 1].properties.isLatest = 'latest'
        }
        this.map.getSource(SRC_FLY).setData(this.liveDS)
        this.map.flyTo({
          center: [this.prevEventMarker.lng, this.prevEventMarker.lat],
          zoom: this.prevEventMarker.zoom ? this.prevEventMarker.zoom : 12,
          speed: 1.2
        })
        this.activeFeatures.splice(0, 1)
      } else if(this.prevEvent.type === 'prompt') {
        // show prompt
        this.isPlaying = false
        this.prompt.primaryField = this.prevEventMarker[this.config.feature.primaryField]
        this.prompt.secondaryFields = this.config.feature.secondaryFields.map(key => this.prevEventMarker[key]).join('')
        this.prompt.description = this.prevEventMarker.description
        this.prompt.image = this.prevEventMarker.image
        this.prompt.show = true
      }
    },
    pause() {
      this.clearTimer()
      this.isPlaying = false
    },
    quitPlay() {
      this.clear()
      this.drawStatic()
    },
    dismissPrompt() {
      this.prompt.show = false
      if(this.config.mode === 'fly') {
        this.fly()
      } else if(this.config.mode === 'play') {
        this.play()
      }
    },
    getFeatureStyles(feature) {
      let colors = this.config.colors
      let styles = {}
      let displayType = feature.properties.display_type
      if(displayType !== 'default' && colors && colors.hasOwnProperty(displayType)) {
        styles.borderColor = colors[displayType]
      }
      return styles
    }
  },
  components: {
    GhostArticle,
    PopupArticle,
    ShareToPlatforms
  }
}
</script>

<style lang="scss">
@import 'watchout-common-functions/assets/mapbox.scss';
</style>
