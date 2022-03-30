<template>
  <div class="iconBlock">
    <FontAwesomeIcon :icon="iconName" :size="iconSize" />
  </div>
</template>

<script >
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faEdit, faIcons, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as IconTypes from '../lib/icon'

// icon 樣式 請參考以下網址
// https://fontawesome.com/v5/search?m=free

library.add(faTrashAlt, faEdit, faIcons, faBars)

export default {
  props: {
    // icon 名稱
    iconName: {
      type: String,
      default: IconTypes.ICONS
    },
    // icon 尺寸大小
    iconSize: {
      type: String,
      default: IconTypes.SIZE.sm
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script >

<style lang="scss" >
@import '~watchout-common-assets/styles/resources';
</style >
