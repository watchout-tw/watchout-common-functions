<template>
  <div class="prompt-overlay dark">
    <div class="prompt with-dismiss correct">
      <img class="image" v-if="data.prompt.image" :src="data.prompt.image" alt="image">
      <div class="primary-secondary-fields font-weight-bold">
        {{ data.prompt.primaryField }}
        &nbsp;
        {{ data.prompt.secondaryFields }}
      </div>
      <div class="title" v-if="data.prompt.title">{{ data.prompt.title }}</div>
      <div class="message" v-if="data.prompt.description">{{ data.prompt.description }}</div>
      <div class="referenceTitle" v-if="data.prompt.isNeedReferences">參考資料</div>
      <div class="reference" v-for=" ( reference, index ) of data.prompt.references" :key="`reference.text_${index}`">
        <div class="referenceContent" v-if="reference.text">{{ reference.text }}</div>
        <a class="referenceLink a-text" v-if="reference.link" :href="reference.link"
           target="_blank"
        >
          {{ reference.link }}
        </a>
      </div>
      <div class="dismiss" @click="removeModal('message')"><span>OK</span></div>
    </div>
  </div>
</template>

<script>
import { knowsWindowManagement } from 'watchout-common-functions/interfaces'

export default {
  mixins: [knowsWindowManagement],
  props: ['data']
}
</script>

<style lang="scss">
@import 'watchout-common-functions/assets/mapbox.scss';
</style>
