<template>
  <div class="component icon">
    <component :is="'div'"
               class="icon-block"
               :class="[classes, isCircle ? 'circle' : '' ]"
    >
      <FontAwesomeIcon :icon="iconName" :size="iconSize" />
    </component>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// icon 樣式 請參考以下網址
// https://fontawesome.com/v5/search?m=free

// size 表格 請參考以下網址
// https://fontawesome.com/docs/web/style/size
// * 記得輸入時記得把前綴 "fa-" 移除

library.add(fas)

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
    classes: {
      type: Array,
      default: () => []
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>

<style lang="scss">
.component.icon {

  .circle {
    border-radius: 1rem;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .icon-block {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
  }
}
</style>
