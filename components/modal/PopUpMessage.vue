<template>
  <div class="prompt-overlay" :class="[config.classForTheme]" v-if="data.show">
    <div class="prompt with-dismiss" :class="config.classForContent">
      <img class="image" v-if="data.image" :src="data.image" alt="image">
      <div class="primary-secondary-fields font-weight-bold">
        {{ data.primaryField }}
        &nbsp;
        {{ data.secondaryFields }}
      </div>
      <div class="title">{{ data.title }}</div>
      <div class="message">{{ data.description }}</div>
      <div class="dismiss" @click="dismissPrompt"><span>OK</span></div>
    </div>
  </div>
</template>

<script>

const defaultConfig = {
  classForTheme: '',
  classForContent: ''
}

const defaultData = {
  show: false,
  image: '',
  primaryField: '',
  secondaryFields: '',
  title: '',
  description: ''
}

export default {
  props: {
    config: {
      type: Object,
      default: defaultConfig
    },
    data: {
      type: Object,
      default: defaultData
    }
  },
  methods: {
    dismissPrompt() {
      this.data.show = false
    }
  }

}
</script>

<style lang="scss">
@import 'watchout-common-functions/assets/mapbox.scss';
</style>
