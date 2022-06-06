<template>
  <div class="iconBlock">
    <FontAwesomeIcon :icon="iconName" :size="iconSize" />
  </div>
</template>

<script >
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTrashAlt,
  faEdit,
  faIcons,
  faBars,
  faChevronCircleLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// icon 樣式 請參考以下網址
// https://fontawesome.com/v5/search?m=free

// size 表格 請參考以下網址
// https://fontawesome.com/docs/web/style/size
// * 記得輸入時記得把前綴 "fa-" 移除

library.add(faTrashAlt, faEdit, faIcons, faBars, faChevronCircleLeft)

export default {
  props: {
    // icon 名稱
    iconName: {
      type: String,
      default: 'icons'
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
