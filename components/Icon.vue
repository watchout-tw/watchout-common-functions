<template>
  <div class="iconBlock">
    <FontAwesomeIcon :icon="iconName" :size="iconSize" />
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faEdit, faIcons, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const ICON_SIZE = {
  '2xs': '2xs', // 10px
  'xs': 'xs', // 12px
  'sm': 'sm', // 14px
  'lg': 'lg', // 20px
  'xl': 'xl', // 24px
  '2xl': '2xl', // 32px
  '1x': '1x', // 16px
  '2x': '2x' // 32px

}

// icon 樣式 請參考以下網址
// https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=solid&m=free

library.add(faTrashAlt, faEdit, faIcons, faAngleRight, faAngleLeft)

export default {
  props: {
    // icon 名稱
    iconName: {
      type: String,
      default: 'faIcons'
    },
    // icon 尺寸大小
    iconSize: {
      type: String,
      default: ICON_SIZE.sm
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';
</style>
