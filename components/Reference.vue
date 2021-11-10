<template>
<div class="reference">
  <drop-down-select placeholder="類型" :options="types" v-model="type" class="small compact" />
  <text-editor placeholder="ID" v-model="id" :classes="['watchout', 'small']" :simple="true" />
</div>
</template>

<script>
import { parseReference, makeReference } from 'watchout-common-functions/lib/watchout'
import DropDownSelect from 'watchout-common-functions/components/DropDownSelect'
import TextEditor from 'watchout-common-functions/components/TextEditor'

const allTypes = [
  {
    category: 'ghost',
    value: 'ghost',
    label: 'ghost'
  },
  {
    category: 'video',
    value: 'youtube',
    label: 'YouTube'
  },
  {
    category: 'video',
    value: 'facebook',
    label: 'Facebook'
  },
  {
    category: 'video',
    value: 'livehouseIn',
    label: 'LIVEhouse.in'
  },
  {
    category: 'watchout',
    value: 'doc',
    label: '文件'
  },
  {
    category: 'watchout',
    value: 'video',
    label: '影片'
  },
  {
    category: 'watchout',
    value: 'event',
    label: '事件'
  },
  {
    category: 'watchout',
    value: 'https',
    label: '外部連結'
  },
  {
    category: 'watchout',
    value: 'http',
    label: '不安全的外部連結'
  }
]

const defaultCategory = 'watchout'

export default {
  props: {
    reference: {
      type: String,
      default: null
    },
    category: {
      type: String,
      default: 'watchout'
    },
    customTypes: {
      type: Array,
      default: () => [] // must use factory method here
    }
  },
  data() {
    let referenceObj = parseReference(this.reference)
    return {
      id: referenceObj.id,
      type: referenceObj.type,
      types: this.customTypes.length > 0 ? this.customTypes : allTypes.filter(type => type.category === (this.category ? this.category : defaultCategory))
    }
  },
  watch: {
    id(newVal, oldVal) {
      if(newVal && this.type) {
        this.$emit('update:reference', makeReference(this.type, newVal).url)
      }
    },
    type(newVal, oldVal) {
      if(newVal && this.id) {
        this.$emit('update:reference', makeReference(newVal, this.id).url)
      }
    }
  },
  components: {
    DropDownSelect,
    TextEditor
  }
}
</script>
