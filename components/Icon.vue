<template>
  <div class="iconBlock">
    <FontAwesomeIcon :icon="iconName" :size="iconSize" />
  </div>
</template>

<script >
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// icon 樣式 請參考以下網址
// https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=solid&m=free

library.add(faTrashAlt, faEdit)

const ICON_NAME_LIST = {
  'trash-alt': 'faTrashAlt',
  'edit': 'faEdit'
}

const ICON_SIZE_LIST = {
  '2xs': '2xs', // 10px
  'xs': 'xs', // 12px
  'sm': 'sm', // 14px
  'lg': 'lg', // 20px
  'xl': 'xl', // 24px
  '2xl': '2xl', // 32px
  '1x': '1x', // 16px
  '2x': '2x' // 32px
}

export default {
  props: {
    // icon 名稱
    iconName: {
      type: String
    },
    // icon 尺寸大小
    iconSize: {
      type: String,
      default: 'sm'
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
