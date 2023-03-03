<template>
  <div class="component icon">
    <div :class="`${isCircle ? 'circle' : ''} ${className} icon-block`">
      <FontAwesomeIcon :icon="iconName" :size="iconSize" />
    </div>
  </div>
</template>

<script >
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCopy,
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

library.add(faCopy, faTrashAlt, faEdit, faIcons, faBars, faChevronCircleLeft)

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
    },
    isCircle: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script >

<style lang="scss" >
.component.icon{

  .circle{
    border-radius: 1rem;
  }

  .icon-block{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
}
</style >
